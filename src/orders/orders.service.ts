import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { and, eq, inArray, sql } from "drizzle-orm";

import { DATABASE } from "../database/database.constants";
import type { Database } from "../database/db";
import {
  order,
  orderItem,
  product,
  shop,
  shopFulfillmentMethod,
  shopPaymentMethod
} from "../database/schema";

import {
  CreateOrderDto,
  OrderFulfillmentType,
  OrderPaymentMethod
} from "./dto/create-order.dto";
import {
  type OrderStatus,
  UpdateOrderStatusDto
} from "./dto/update-order-status.dto";

type DbTransaction = Parameters<Parameters<Database["transaction"]>[0]>[0];

type ProductRecord = {
  id: string;
  shopId: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
};

type OrderItemInput = {
  productId: string;
  quantity: number;
};

type DeliveryDetails = {
  radius: number;
  minimumOrder: number;
  deliveryFee: number;
};

@Injectable()
export class OrdersService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database
  ) {}

  async create(userId: string, shopSlug: string, dto: CreateOrderDto) {
    const items = this.normalizeItems(dto.items);

    if (items.length === 0) {
      throw new BadRequestException("Order must contain at least one item");
    }

    return this.db.transaction(async tx => {
      const foundShop = await this.findShop(tx, shopSlug);

      if (!foundShop) {
        throw new NotFoundException("Shop not found");
      }

      if (!foundShop.isActive) {
        throw new ForbiddenException("Shop is not active");
      }

      const products = await tx
        .select({
          id: product.id,
          shopId: product.shopId,
          name: product.name,
          price: product.price,
          stock: product.stock,
          isActive: product.isActive
        })
        .from(product)
        .where(
          and(
            eq(product.shopId, foundShop.id),
            inArray(
              product.id,
              items.map(item => item.productId)
            )
          )
        )
        .for("update");

      const productMap = new Map(products.map(item => [item.id, item]));

      this.validateProducts(items, productMap, foundShop.id);

      this.validateStock(items, productMap);

      const fulfillment = await this.findFulfillmentMethod(
        tx,
        foundShop.id,
        dto.fulfillmentType
      );

      const payment = await this.findPaymentMethod(
        tx,
        foundShop.id,
        dto.paymentMethod
      );

      if (dto.fulfillmentType === OrderFulfillmentType.DELIVERY) {
        this.validateDeliveryInput(dto);

        await this.validateDelivery(
          tx,
          foundShop.id,
          dto.deliveryLatitude!,
          dto.deliveryLongitude!,
          fulfillment.details
        );
      }

      const orderItems = items.map(item => {
        const foundProduct = productMap.get(item.productId)!;

        const itemSubtotal = foundProduct.price * item.quantity;

        return {
          id: crypto.randomUUID(),
          productId: foundProduct.id,
          productName: foundProduct.name,
          quantity: item.quantity,
          price: foundProduct.price,
          subtotal: itemSubtotal
        };
      });

      const subtotal = orderItems.reduce(
        (total, item) => total + item.subtotal,
        0
      );

      const deliveryFee =
        dto.fulfillmentType === OrderFulfillmentType.DELIVERY
          ? this.getDeliveryDetails(fulfillment.details).deliveryFee
          : 0;

      this.validateMinimumOrder(
        subtotal,
        fulfillment.details,
        dto.fulfillmentType
      );

      const total = subtotal + deliveryFee;
      const paymentDetails = payment.details ?? null;
      const orderId = crypto.randomUUID();

      const [createdOrder] = await tx
        .insert(order)
        .values({
          id: orderId,
          userId,
          shopId: foundShop.id,
          customerName: dto.customerName,
          customerEmail: dto.customerEmail ?? null,
          customerPhone: dto.customerPhone,
          fulfillmentType: dto.fulfillmentType,
          paymentMethod: dto.paymentMethod,
          paymentDetails,
          deliveryAddress:
            dto.fulfillmentType === OrderFulfillmentType.DELIVERY
              ? dto.deliveryAddress!
              : null,
          deliveryLatitude:
            dto.fulfillmentType === OrderFulfillmentType.DELIVERY
              ? String(dto.deliveryLatitude)
              : null,
          deliveryLongitude:
            dto.fulfillmentType === OrderFulfillmentType.DELIVERY
              ? String(dto.deliveryLongitude)
              : null,
          note: dto.note ?? null,
          status: "pending",
          subtotal,
          deliveryFee,
          total
        })
        .returning();

      await tx.insert(orderItem).values(
        orderItems.map(item => ({
          id: item.id,
          orderId,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal
        }))
      );

      for (const item of items) {
        const [updatedProduct] = await tx
          .update(product)
          .set({
            stock: sql`${product.stock} - ${item.quantity}`
          })
          .where(
            and(
              eq(product.id, item.productId),
              eq(product.shopId, foundShop.id),
              sql`${product.stock} >= ${item.quantity}`
            )
          )
          .returning({
            id: product.id
          });

        if (!updatedProduct) {
          throw new ConflictException(
            "Product stock changed while creating the order"
          );
        }
      }

      return {
        ...createdOrder,
        items: orderItems
      };
    });
  }

  async findMine(userId: string) {
    const orders = await this.db
      .select({
        id: order.id,
        shopId: order.shopId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        fulfillmentType: order.fulfillmentType,
        paymentMethod: order.paymentMethod,
        deliveryAddress: order.deliveryAddress,
        deliveryLatitude: order.deliveryLatitude,
        deliveryLongitude: order.deliveryLongitude,
        note: order.note,
        status: order.status,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        total: order.total,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        shopName: shop.name,
        shopSlug: shop.slug
      })
      .from(order)
      .innerJoin(shop, eq(order.shopId, shop.id))
      .where(eq(order.userId, userId))
      .orderBy(sql`${order.createdAt} DESC`);

    return orders;
  }

  async findById(userId: string, orderId: string) {
    const [foundOrder] = await this.db
      .select({
        id: order.id,
        userId: order.userId,
        shopId: order.shopId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        fulfillmentType: order.fulfillmentType,
        paymentMethod: order.paymentMethod,
        paymentDetails: order.paymentDetails,
        deliveryAddress: order.deliveryAddress,
        deliveryLatitude: order.deliveryLatitude,
        deliveryLongitude: order.deliveryLongitude,
        note: order.note,
        status: order.status,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        total: order.total,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        shopName: shop.name,
        shopSlug: shop.slug
      })
      .from(order)
      .innerJoin(shop, eq(order.shopId, shop.id))
      .where(and(eq(order.id, orderId), eq(order.userId, userId)))
      .limit(1);

    if (!foundOrder) {
      throw new NotFoundException("Order not found");
    }

    const items = await this.db
      .select({
        id: orderItem.id,
        productId: orderItem.productId,
        productName: orderItem.productName,
        quantity: orderItem.quantity,
        price: orderItem.price,
        subtotal: orderItem.subtotal
      })
      .from(orderItem)
      .where(eq(orderItem.orderId, orderId));

    return {
      ...foundOrder,
      items
    };
  }

  async findByShop(userId: string, shopSlug: string) {
    const foundShop = await this.findOwnerShop(this.db, userId, shopSlug);

    return this.db
      .select({
        id: order.id,
        userId: order.userId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        fulfillmentType: order.fulfillmentType,
        paymentMethod: order.paymentMethod,
        deliveryAddress: order.deliveryAddress,
        status: order.status,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        total: order.total,
        note: order.note,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      })
      .from(order)
      .where(eq(order.shopId, foundShop.id))
      .orderBy(sql`${order.createdAt} DESC`);
  }

  async findByShopId(userId: string, shopSlug: string, orderId: string) {
    const foundShop = await this.findOwnerShop(this.db, userId, shopSlug);

    const [foundOrder] = await this.db
      .select({
        id: order.id,
        userId: order.userId,
        shopId: order.shopId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        fulfillmentType: order.fulfillmentType,
        paymentMethod: order.paymentMethod,
        paymentDetails: order.paymentDetails,
        deliveryAddress: order.deliveryAddress,
        deliveryLatitude: order.deliveryLatitude,
        deliveryLongitude: order.deliveryLongitude,
        note: order.note,
        status: order.status,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        total: order.total,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      })
      .from(order)
      .where(and(eq(order.id, orderId), eq(order.shopId, foundShop.id)))
      .limit(1);

    if (!foundOrder) {
      throw new NotFoundException("Order not found");
    }

    const items = await this.db
      .select({
        id: orderItem.id,
        productId: orderItem.productId,
        productName: orderItem.productName,
        quantity: orderItem.quantity,
        price: orderItem.price,
        subtotal: orderItem.subtotal
      })
      .from(orderItem)
      .where(eq(orderItem.orderId, orderId));

    return {
      ...foundOrder,
      items
    };
  }

  async updateStatus(
    userId: string,
    shopSlug: string,
    orderId: string,
    dto: UpdateOrderStatusDto
  ) {
    const foundShop = await this.findOwnerShop(this.db, userId, shopSlug);

    const [foundOrder] = await this.db
      .select({
        id: order.id,
        shopId: order.shopId,
        status: order.status
      })
      .from(order)
      .where(and(eq(order.id, orderId), eq(order.shopId, foundShop.id)))
      .limit(1);

    if (!foundOrder) {
      throw new NotFoundException("Order not found");
    }

    this.validateStatusTransition(foundOrder.status, dto.status);

    const [updatedOrder] = await this.db
      .update(order)
      .set({
        status: dto.status
      })
      .where(and(eq(order.id, orderId), eq(order.shopId, foundShop.id)))
      .returning();

    if (!updatedOrder) {
      throw new NotFoundException("Order not found");
    }

    return updatedOrder;
  }

  private normalizeItems(items: OrderItemInput[]): OrderItemInput[] {
    const quantities = new Map<string, number>();

    for (const item of items) {
      if (!item.productId || item.quantity < 1) {
        throw new BadRequestException("Invalid order item");
      }

      quantities.set(
        item.productId,
        (quantities.get(item.productId) ?? 0) + item.quantity
      );
    }

    return [...quantities.entries()].map(([productId, quantity]) => ({
      productId,
      quantity
    }));
  }

  private async findShop(tx: DbTransaction, shopSlug: string) {
    const [foundShop] = await tx
      .select({
        id: shop.id,
        isActive: shop.isActive,
        name: shop.name,
        slug: shop.slug,
        latitude: shop.latitude,
        longitude: shop.longitude
      })
      .from(shop)
      .where(eq(shop.slug, shopSlug))
      .limit(1);

    return foundShop;
  }

  private async findOwnerShop(
    db: Database | DbTransaction,
    userId: string,
    shopSlug: string
  ) {
    const [foundShop] = await db
      .select({
        id: shop.id,
        isActive: shop.isActive,
        name: shop.name,
        slug: shop.slug
      })
      .from(shop)
      .where(and(eq(shop.slug, shopSlug), eq(shop.userId, userId)))
      .limit(1);

    if (!foundShop) {
      throw new ForbiddenException("You do not have access to this shop");
    }

    return foundShop;
  }

  private validateProducts(
    items: OrderItemInput[],
    productMap: Map<string, ProductRecord>,
    shopId: string
  ) {
    for (const item of items) {
      const foundProduct = productMap.get(item.productId);

      if (!foundProduct) {
        throw new NotFoundException(
          `Product ${item.productId} not found in this shop`
        );
      }

      if (foundProduct.shopId !== shopId) {
        throw new NotFoundException(
          `Product ${item.productId} not found in this shop`
        );
      }

      if (!foundProduct.isActive) {
        throw new ConflictException(
          `Product ${foundProduct.name} is not active`
        );
      }
    }
  }

  private validateStock(
    items: OrderItemInput[],
    productMap: Map<string, ProductRecord>
  ) {
    for (const item of items) {
      const foundProduct = productMap.get(item.productId)!;

      if (foundProduct.stock < item.quantity) {
        throw new ConflictException(
          `Insufficient stock for product ${foundProduct.name}`
        );
      }
    }
  }

  private async findFulfillmentMethod(
    tx: DbTransaction,
    shopId: string,
    type: OrderFulfillmentType
  ) {
    const [method] = await tx
      .select({
        id: shopFulfillmentMethod.id,
        type: shopFulfillmentMethod.type,
        details: shopFulfillmentMethod.details,
        isActive: shopFulfillmentMethod.isActive
      })
      .from(shopFulfillmentMethod)
      .where(
        and(
          eq(shopFulfillmentMethod.shopId, shopId),
          eq(shopFulfillmentMethod.type, type),
          eq(shopFulfillmentMethod.isActive, true)
        )
      )
      .limit(1);

    if (!method) {
      throw new ConflictException(
        `Fulfillment method ${type} is not available`
      );
    }

    return method;
  }

  private async findPaymentMethod(
    tx: DbTransaction,
    shopId: string,
    type: OrderPaymentMethod
  ) {
    const [method] = await tx
      .select({
        id: shopPaymentMethod.id,
        type: shopPaymentMethod.type,
        details: shopPaymentMethod.details,
        isActive: shopPaymentMethod.isActive
      })
      .from(shopPaymentMethod)
      .where(
        and(
          eq(shopPaymentMethod.shopId, shopId),
          eq(shopPaymentMethod.type, type),
          eq(shopPaymentMethod.isActive, true)
        )
      )
      .limit(1);

    if (!method) {
      throw new ConflictException(`Payment method ${type} is not available`);
    }

    return method;
  }

  private validateDeliveryInput(dto: CreateOrderDto) {
    if (!dto.deliveryAddress) {
      throw new BadRequestException("Delivery address is required");
    }

    if (
      dto.deliveryLatitude === undefined ||
      dto.deliveryLongitude === undefined
    ) {
      throw new BadRequestException("Delivery coordinates are required");
    }

    if (dto.deliveryLatitude < -90 || dto.deliveryLatitude > 90) {
      throw new BadRequestException("Invalid delivery latitude");
    }

    if (dto.deliveryLongitude < -180 || dto.deliveryLongitude > 180) {
      throw new BadRequestException("Invalid delivery longitude");
    }
  }

  private async validateDelivery(
    tx: DbTransaction,
    shopId: string,
    deliveryLatitude: number,
    deliveryLongitude: number,
    details: unknown
  ) {
    const delivery = this.getDeliveryDetails(details);

    const [foundShop] = await tx
      .select({
        latitude: shop.latitude,
        longitude: shop.longitude
      })
      .from(shop)
      .where(eq(shop.id, shopId))
      .limit(1);

    if (
      !foundShop ||
      foundShop.latitude === null ||
      foundShop.longitude === null
    ) {
      throw new ConflictException("Shop delivery location is not configured");
    }

    const distance = this.calculateDistance(
      Number(foundShop.latitude),
      Number(foundShop.longitude),
      deliveryLatitude,
      deliveryLongitude
    );

    if (distance > delivery.radius) {
      throw new BadRequestException(
        "Delivery location is outside the shop delivery radius"
      );
    }
  }

  private getDeliveryDetails(details: unknown): DeliveryDetails {
    if (typeof details !== "object" || details === null) {
      throw new BadRequestException("Shop delivery configuration is invalid");
    }

    const value = details as Record<string, unknown>;

    if (typeof value.radius !== "number" || value.radius <= 0) {
      throw new BadRequestException("Shop delivery radius is invalid");
    }

    if (typeof value.minimumOrder !== "number" || value.minimumOrder < 0) {
      throw new BadRequestException("Shop minimum order is invalid");
    }

    if (typeof value.deliveryFee !== "number" || value.deliveryFee < 0) {
      throw new BadRequestException("Shop delivery fee is invalid");
    }

    return {
      radius: value.radius,
      minimumOrder: value.minimumOrder,
      deliveryFee: value.deliveryFee
    };
  }

  private validateMinimumOrder(
    subtotal: number,
    details: unknown,
    fulfillmentType: OrderFulfillmentType
  ) {
    if (fulfillmentType !== OrderFulfillmentType.DELIVERY) {
      return;
    }

    const delivery = this.getDeliveryDetails(details);

    if (subtotal < delivery.minimumOrder) {
      throw new BadRequestException(
        `Minimum order for delivery is ${delivery.minimumOrder}`
      );
    }
  }

  private calculateDistance(
    latitude1: number,
    longitude1: number,
    latitude2: number,
    longitude2: number
  ) {
    const earthRadiusKm = 6371;
    const dLat = this.toRadians(latitude2 - latitude1);
    const dLon = this.toRadians(longitude2 - longitude1);
    const lat1 = this.toRadians(latitude1);
    const lat2 = this.toRadians(latitude2);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
  }

  private toRadians(value: number) {
    return value * (Math.PI / 180);
  }

  private validateStatusTransition(
    currentStatus: OrderStatus,
    nextStatus: OrderStatus
  ) {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
      pending: ["confirmed", "canceled"],
      confirmed: ["preparing", "canceled"],
      preparing: ["ready", "canceled"],
      ready: ["completed"],
      completed: [],
      canceled: []
    };

    if (!transitions[currentStatus].includes(nextStatus)) {
      throw new ConflictException(
        `Cannot change order status from ${currentStatus} to ${nextStatus}`
      );
    }
  }
}
