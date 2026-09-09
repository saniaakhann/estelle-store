<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    // ==========================================
    // GET ALL ACTIVE PRODUCTS
    // ==========================================

    public function index()
    {
        $products = Product::where('is_active', true)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'products' => $products,
        ]);
    }


    // ==========================================
    // GET ONE PRODUCT
    // ==========================================

    public function show(Product $product)
    {
        if (!$product->is_active) {

            return response()->json([
                'success' => false,
                'message' => 'Product is not available.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'product' => $product,
        ]);
    }


    // ==========================================
    // CREATE PRODUCT - ADMIN
    // ==========================================

    public function store(Request $request)
    {
        $validated = $request->validate([

            'name' => 'required|string|max:255',

            'description' => 'nullable|string',

            'price' => 'required|numeric|min:0',

            'image' => 'nullable|string|max:2048',

            'category' => 'nullable|string|max:100',

            'stock' => 'required|integer|min:0',

            'is_active' => 'sometimes|boolean',
        ]);


        // Create unique slug

        $validated['slug'] =
            Str::slug($validated['name'])
            . '-'
            . Str::random(6);


        $product = Product::create($validated);


        return response()->json([

            'success' => true,

            'message' => 'Product created successfully.',

            'product' => $product,

        ], 201);
    }


    // ==========================================
    // UPDATE PRODUCT - ADMIN
    // ==========================================

    public function update(
        Request $request,
        Product $product
    ) {

        $validated = $request->validate([

            'name' => 'sometimes|required|string|max:255',

            'description' => 'nullable|string',

            'price' => 'sometimes|required|numeric|min:0',

            'image' => 'nullable|string|max:2048',

            'category' => 'nullable|string|max:100',

            'stock' => 'sometimes|required|integer|min:0',

            'is_active' => 'sometimes|boolean',
        ]);


        // Generate new slug if name changes

        if (isset($validated['name'])) {

            $validated['slug'] =
                Str::slug($validated['name'])
                . '-'
                . Str::random(6);
        }


        $product->update($validated);


        return response()->json([

            'success' => true,

            'message' => 'Product updated successfully.',

            'product' => $product->fresh(),

        ]);
    }


    // ==========================================
    // DELETE PRODUCT - ADMIN
    // ==========================================

    public function destroy(Product $product)
    {
        $product->delete();


        return response()->json([

            'success' => true,

            'message' => 'Product deleted successfully.',

        ]);
    }
}