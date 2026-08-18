import type { APIRequestContext } from '@playwright/test'
import { gql } from './graphql-api'

export async function createProductCategoryViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  name: string,
  parentId?: string,
) {
  const data = await gql<{ createProductCategory: { id: string; fullPath: string } }>(
    request,
    `mutation($input: CreateProductCategoryInput!) {
      createProductCategory(input: $input) { id name fullPath }
    }`,
    { input: { name, parentId, organizationId } },
    token,
  )
  return data.createProductCategory
}

export async function createUomViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  name: string,
  category: string,
) {
  const data = await gql<{ createUom: { id: string; name: string; gstUqc?: string | null } }>(
    request,
    `mutation($input: CreateUomInput!) {
      createUom(input: $input) { id name category gstUqc }
    }`,
    { input: { name, category, gstUqc: 'NOS', organizationId } },
    token,
  )
  return data.createUom
}

export async function createAttributeViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  name: string,
  values: string[],
) {
  const data = await gql<{ createAttribute: { id: string; values: Array<{ id: string; value: string }> } }>(
    request,
    `mutation($input: CreateAttributeInput!) {
      createAttribute(input: $input) { id name values { id value } }
    }`,
    { input: { name, values, organizationId } },
    token,
  )
  return data.createAttribute
}

export async function createProductViaApi(
  request: APIRequestContext,
  token: string,
  organizationId: string,
  tag: string,
  extra: Record<string, unknown> = {},
) {
  const data = await gql<{ createProduct: { id: string; seqNo?: string | null; internalReference?: string | null } }>(
    request,
    `mutation($input: CreateProductInput!) {
      createProduct(input: $input) { id seqNo internalReference }
    }`,
    {
      input: {
        name: `E2E Product ${tag}`,
        canBePurchased: true,
        canBeSold: false,
        productType: 'goods',
        trackInventory: true,
        costPrice: 100,
        organizationId,
        ...extra,
      },
    },
    token,
  )
  return data.createProduct
}

export async function getProductViaApi(request: APIRequestContext, token: string, id: string) {
  const data = await gql<{
    product: {
      id: string
      name: string
      internalReference?: string | null
      canBePurchased: boolean
      canBeSold: boolean
      variants: Array<{ id: string; displayName: string }>
    }
  }>(
    request,
    `query($id: ID!) {
      product(id: $id) {
        id name internalReference canBePurchased canBeSold
        variants { id displayName }
      }
    }`,
    { id },
    token,
  )
  return data.product
}

/** Gap fix: image upload — Product.images[] stores uploaded document URLs. */
export async function updateProductImagesViaApi(request: APIRequestContext, token: string, id: string, images: string[]) {
  const data = await gql<{ updateProduct: { id: string; images: string[] } }>(
    request,
    `mutation($id: ID!, $input: UpdateProductInput!) { updateProduct(id: $id, input: $input) { id images } }`,
    { id, input: { images } },
    token,
  )
  return data.updateProduct
}

/** Gap fix: Packaging + Reordering Rules — embedded arrays on Product. */
export async function updateProductPackagingAndReorderingViaApi(request: APIRequestContext, token: string, id: string) {
  const data = await gql<{
    updateProduct: {
      id: string
      packagings: Array<{ id: string; name: string; qtyPerPackage: number }>
      reorderingRules: Array<{ id: string; minQty: number; maxQty: number }>
    }
  }>(
    request,
    `mutation($id: ID!, $input: UpdateProductInput!) {
      updateProduct(id: $id, input: $input) {
        id
        packagings { id name qtyPerPackage }
        reorderingRules { id minQty maxQty }
      }
    }`,
    { id, input: { packagings: [{ name: 'Box of 10', qtyPerPackage: 10 }], reorderingRules: [{ minQty: 5, maxQty: 50 }] } },
    token,
  )
  return data.updateProduct
}

/** Gap fix: smart buttons — On Hand / Forecasted / Purchased computed fields. */
export async function getProductSmartButtonsViaApi(request: APIRequestContext, token: string, id: string) {
  const data = await gql<{
    product: { id: string; onHandQty: number; forecastedQty: number; purchasedQty: number }
  }>(
    request,
    `query($id: ID!) {
      product(id: $id) { id onHandQty forecastedQty purchasedQty }
    }`,
    { id },
    token,
  )
  return data.product
}

/** Gap fix: Update Quantity action. */
export async function updateProductQuantityViaApi(request: APIRequestContext, token: string, id: string, quantity: number) {
  const data = await gql<{ updateProductQuantity: { id: string; onHandQty: number } }>(
    request,
    `mutation($productId: ID!, $quantity: Float!) {
      updateProductQuantity(productId: $productId, quantity: $quantity) { id onHandQty }
    }`,
    { productId: id, quantity },
    token,
  )
  return data.updateProductQuantity
}

/** Attaches a vendor pricelist entry to a product — prerequisite for the Replenish action. */
export async function setVendorPricelistViaApi(
  request: APIRequestContext,
  token: string,
  productId: string,
  vendorId: string,
  price: number,
) {
  const data = await gql<{ updateProduct: { id: string } }>(
    request,
    `mutation($id: ID!, $input: UpdateProductInput!) { updateProduct(id: $id, input: $input) { id } }`,
    { id: productId, input: { vendorPricelist: [{ vendorId, price, minQty: 1 }] } },
    token,
  )
  return data.updateProduct
}

/** Gap fix: Replenish action — creates a draft RFQ from the cheapest vendor pricelist entry. */
export async function replenishProductViaApi(request: APIRequestContext, token: string, id: string, quantity: number) {
  const data = await gql<{
    replenishProduct: { vendorId: string; quantity: number; unitPrice: number; purchaseOrder: { id: string; seqNo?: string | null; status: string } }
  }>(
    request,
    `mutation($productId: ID!, $quantity: Float) {
      replenishProduct(productId: $productId, quantity: $quantity) {
        vendorId quantity unitPrice
        purchaseOrder { id seqNo status }
      }
    }`,
    { productId: id, quantity },
    token,
  )
  return data.replenishProduct
}
