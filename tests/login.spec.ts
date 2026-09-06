import { test, expect } from '@playwright/test';

// Тест бүр test isolation зарчмаар бие даан ажиллах ёстой тул
// хамтын beforeEach ашиглан хуудсыг тус бүрдээ шинээр ачаална.
test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
});

test('1. Амжилттай нэвтрэх', async ({ page }) => {
  // Орчин үеийн locator ашиглав: getByPlaceholder, getByRole
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // Нэвтэрсний дараа "Products" гарч ирж буйг шалгана
  await expect(page.getByText('Products')).toBeVisible();
  await expect(page).toHaveURL(/inventory.html/);

  // Тестээ зөв төгсгөх: цэс нээгээд Logout хийнэ
  await page.locator('#react-burger-menu-btn').click();
  const logoutLink = page.locator('#logout_sidebar_link');
  await logoutLink.waitFor({ state: 'visible' });
  await logoutLink.click();
});

test('2. Амжилтгүй нэвтрэх — буруу нууц үг', async ({ page }) => {
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('buruu_nuuts_ug');
  await page.getByRole('button', { name: 'Login' }).click();

  // Алдааны мессеж харагдаж буйг шалгана
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toContainText(
    'Username and password do not match'
  );
  // Нэвтэрч чадаагүй тул URL өөрчлөгдөөгүй хэвээр байна
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});

test('3. Нэвтэрсний дараа бараа сагслах', async ({ page }) => {
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Products')).toBeVisible();

  // Эхний барааг сагслах товч дарна
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  
  // Сагсны тоо 1 болсныг шалгана
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // Тестээ зөв төгсгөх
  await page.locator('#react-burger-menu-btn').click();
  const logoutLink = page.locator('#logout_sidebar_link');
  await logoutLink.waitFor({ state: 'visible' });
  await logoutLink.click();
});
