import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

test('Hepsiburada Ürün Akışı Testi', async ({ page, context }) => {
  // 1. Ana sayfa açılır
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.acceptCookies();

  // 2. İlk ürüne tıkla (popup olarak açılır)
  const [productPage_instance] = await Promise.all([
    context.waitForEvent('page'),
    homePage.clickFirstProduct(),
  ]);

  // ProductPage instance oluştur
  const productPage = new ProductPage(productPage_instance);

  // 3. Ürün bilgilerini al
  const productInfo = await productPage.getInfo();
  console.log(`✓ Detay Sayfası - Ürün Bilgileri: ${productInfo.brand} - ${productInfo.title} / Fiyat: ${productInfo.price}`);

  // 4. Sepete ekle
  await productPage.addToCart();

  // 5. Modal'ı kapat
  await productPage.closeModal();

  // 6. Sepete git
  await productPage.goToCart();

  // 7. Sepet sayfasında ürünü doğrula
  const cartPage = new CartPage(productPage_instance);
  await cartPage.verifyProductInCart(productInfo.title);

  // 8. Alışverişi tamamla ve Üye olmadan devam et
  await cartPage.proceedToCheckout();

  console.log('✓ Tüm akış başarıyla tamamlandı!');
});
