import { test, expect } from '@playwright/test';

test('testpage', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Dark' }).click();
  await page.getByText('Expence Tracker LightSelect').click();

  // Salary
  await page.getByPlaceholder('Enter Name (example : Salary)').fill('Salary');
  await page.getByPlaceholder('Enter amount (income, -').fill('3000');
  await page.getByLabel('Select Category').selectOption('Income');
  await page.getByLabel('Select Currency').selectOption('$');
  await page.getByRole('button', { name: 'Add transaction' }).click();


  // Netflix subscription
  await page.getByPlaceholder('Enter Name (example : Salary)').fill('Netflix subscription');
  await page.getByPlaceholder('Enter amount (income, -').fill('-10');
  await page.getByLabel('Select Category').selectOption('Entertainment');
  await page.getByLabel('Select Currency').selectOption('£');
  await page.getByRole('button', { name: 'Add transaction' }).click();


  // Rent
  await page.getByPlaceholder('Enter Name (example : Salary)').fill('Rent');
  await page.getByPlaceholder('Enter amount (income, -').fill('-900');
  await page.getByLabel('Select Category').selectOption('Utilities');
  await page.getByLabel('Select Currency').selectOption('£');
  await page.getByRole('button', { name: 'Add transaction' }).click();
  await expect(page.getByText('Rent')).toBeVisible();
  await expect(page.getByText('-1250')).toBeVisible();

  // Grocery
  await page.getByPlaceholder('Enter Name (example : Salary)').fill('Groceries');
  await page.getByPlaceholder('Enter amount (income, -').fill('-500');
  await page.getByLabel('Select Category').selectOption('Food');
  await page.getByLabel('Select Currency').selectOption('£');
  await page.getByRole('button', { name: 'Add transaction' }).click();
  await expect(page.getByText('Groceries')).toBeVisible();
  await expect(page.getByText('-694.44')).toBeVisible();



  // Gas
  await page.getByPlaceholder('Enter Name (example : Salary)').fill('Gas');
  await page.getByPlaceholder('Enter amount (income, -').fill('-300');
  await page.getByLabel('Select Category').selectOption('Income');
  await page.getByLabel('Select Currency').selectOption('$');
  await page.getByRole('button', { name: 'Add transaction' }).click();
  await expect(page.getByText('Gas')).toBeVisible();
  await expect(page.getByText('-300')).toBeVisible();

  // Ice-cream
  await page.getByPlaceholder('Enter Name (example : Salary)').fill('Ice-cream');
  await page.getByPlaceholder('Enter amount (income, -').fill('-5');
  await page.getByLabel('Select Category').selectOption('Income');
  await page.getByLabel('Select Currency').selectOption('$');
  await page.getByRole('button', { name: 'Add transaction' }).click();
  await expect(page.getByText('Ice-cream')).toBeVisible();
  await expect(page.getByText('-5')).toBeVisible();

  await page.locator('li').filter({ hasText: 'Ice-creamIncome$-5x' }).getByRole('button').click();
  await expect(page.getByText('Ice-cream')).toBeHidden();



  // Delete all transactions
  await page.locator('li').filter({ hasText: 'Netflix' }).getByRole('button').click();
  await expect(page.getByText('Netflix subscription')).toBeHidden();
  
  await page.locator('li').filter({ hasText: 'Salary' }).getByRole('button').click();
  await expect(page.getByText('Salary')).toBeHidden();
  
  await page.locator('li').filter({ hasText: 'Rent' }).getByRole('button').click();
  await expect(page.getByText('Rent')).toBeHidden();
  
  await page.locator('li').filter({ hasText: 'Groceries' }).getByRole('button').click();
  await expect(page.getByText('Groceries')).toBeHidden();

  await page.locator('li').filter({ hasText: 'Gas' }).getByRole('button').click();
  await expect(page.getByText('Gas')).toBeHidden();
  
  

});
