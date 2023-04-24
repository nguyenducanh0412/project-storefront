import { BaseProduct, Product } from "../../interfaces/IProduct";
import { ProductService } from "../../services/ProductService";

const productService = new ProductService();

describe("testing for product service", () => {
  const product: BaseProduct = {
    name: "Milk",
    price: 2000,
  };

  async function createProduct(productParams: BaseProduct) {
    return productService.create(productParams);
  }

  async function deleteProduct(id: number) {
    return productService.delete(id);
  }
  it("testing for create a product", async () => {
    const createdProduct: Product = await createProduct(product);

    expect(createdProduct).toEqual({
      id: createdProduct.id,
      ...product,
    });

    await deleteProduct(createdProduct.id);
  });

  it("testing for update the product", async () => {
    const createdProduct: Product = await createProduct(product);
    const newProductData: BaseProduct = {
      name: "Milk update",
      price: 6666,
    };

    const { name, price } = await productService.update(
      createdProduct.id,
      newProductData
    );

    expect(name).toEqual(newProductData.name);
    expect(price).toEqual(newProductData.price);

    await deleteProduct(createdProduct.id);
  });
});
