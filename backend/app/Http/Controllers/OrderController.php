<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // =====================================================
    // CREATE ORDER
    // =====================================================

    public function store(Request $request)
    {
        $validated = $request->validate([
            'shipping_name' =>
                'required|string|max:255',

            'shipping_phone' =>
                'required|string|max:20',

            'shipping_address' =>
                'required|string',

            'payment_method' =>
                'required|in:cod',

            'items' =>
                'required|array|min:1',

            'items.*.product_id' =>
                'required|exists:products,id',

            'items.*.quantity' =>
                'required|integer|min:1',
        ]);


        $order = DB::transaction(function () use (
            $validated,
            $request
        ) {

            $total = 0;

            $products = [];


            // =================================================
            // CHECK PRODUCTS
            // =================================================

            foreach ($validated['items'] as $item) {

                $product =
                    Product::findOrFail(
                        $item['product_id']
                    );


                // Product must be active

                if (!$product->is_active) {

                    abort(
                        422,
                        "Product {$product->name} is not available."
                    );
                }


                // Check stock

                if (
                    $product->stock <
                    $item['quantity']
                ) {

                    abort(
                        422,
                        "Not enough stock for {$product->name}."
                    );
                }


                // Calculate total

                $total +=
                    $product->price *
                    $item['quantity'];


                $products[] = [
                    'product' =>
                        $product,

                    'quantity' =>
                        $item['quantity'],
                ];
            }


            // =================================================
            // CREATE ORDER
            // =================================================

            $order = Order::create([

                // IMPORTANT:
                // Get user from authenticated token
                // instead of trusting frontend user_id

                'user_id' =>
                    $request->user()->id,

                'total_amount' =>
                    $total,

                'status' =>
                    'pending',

                'shipping_name' =>
                    $validated['shipping_name'],

                'shipping_phone' =>
                    $validated['shipping_phone'],

                'shipping_address' =>
                    $validated['shipping_address'],

                'payment_method' =>
                    $validated['payment_method'],
            ]);


            // =================================================
            // CREATE ORDER ITEMS
            // =================================================

            foreach ($products as $item) {

                $product =
                    $item['product'];

                $quantity =
                    $item['quantity'];


                OrderItem::create([

                    'order_id' =>
                        $order->id,

                    'product_id' =>
                        $product->id,

                    'product_name' =>
                        $product->name,

                    'price' =>
                        $product->price,

                    'quantity' =>
                        $quantity,
                ]);


                // Reduce stock

                $product->decrement(
                    'stock',
                    $quantity
                );
            }


            return $order;
        });


        return response()->json([

            'success' =>
                true,

            'message' =>
                'Order placed successfully.',

            'order' =>
                $order->load('items'),

        ], 201);
    }


    // =====================================================
    // SHOW SINGLE ORDER
    // =====================================================

    public function show(
        Request $request,
        Order $order
    ) {

        // User can only view their own order

        if (
            $order->user_id !==
            $request->user()->id
        ) {

            return response()->json([

                'success' =>
                    false,

                'message' =>
                    'You are not allowed to view this order.',

            ], 403);
        }


        return response()->json([

            'success' =>
                true,

            'order' =>
                $order->load('items'),

        ]);
    }


    // =====================================================
    // GET CUSTOMER ORDERS
    // =====================================================

    public function index(
        Request $request
    ) {

        // Only return the logged-in user's orders

        $orders = Order::with('items')
            ->where(
                'user_id',
                $request->user()->id
            )
            ->latest()
            ->get();


        return response()->json([

            'success' =>
                true,

            'orders' =>
                $orders,

        ]);
    }


    // =====================================================
    // UPDATE ORDER STATUS
    // =====================================================

    public function updateStatus(
        Request $request,
        Order $order
    ) {

        $validated = $request->validate([

            'status' =>
                'required|in:accepted,rejected',

        ]);


        $order->update([

            'status' =>
                $validated['status'],

        ]);


        return response()->json([

            'success' =>
                true,

            'message' =>
                'Order status updated successfully.',

            'order' =>
                $order
                    ->fresh()
                    ->load('items'),

        ]);
    }
}