import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import midtransClient from "midtrans-client";

@Injectable()
export class MidtransService {
  private readonly snap: midtransClient.Snap;

  constructor(private readonly configService: ConfigService) {
    const serverKey = this.configService.get<string>("MIDTRANS_SERVER_KEY");

    const isProduction =
      this.configService.get<string>("MIDTRANS_IS_PRODUCTION") === "true";

    if (!serverKey) {
      throw new InternalServerErrorException(
        "MIDTRANS_SERVER_KEY is not configured"
      );
    }

    this.snap = new midtransClient.Snap({
      isProduction,
      serverKey
    });
  }

  async createTransaction(params: {
    orderId: string;
    grossAmount: number;
    customer: {
      firstName: string;
      email: string;
    };
  }) {
    return this.snap.createTransaction({
      transaction_details: {
        order_id: params.orderId,
        gross_amount: params.grossAmount
      },

      item_details: [
        {
          id: "premium",
          name: "Premium Subscription",
          price: params.grossAmount,
          quantity: 1
        }
      ],

      customer_details: {
        first_name: params.customer.firstName,
        email: params.customer.email
      }
    });
  }
}
