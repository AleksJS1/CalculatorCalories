require('dotenv').config();
const { connectDatabase, closeDatabase } = require('../config/db');
const { FoodRepository } = require('../repositories/foodRepository');

const defaults = [
  { name: 'Куряче філе', category: 'protein', caloriesPer100g: 165, proteinPer100g: 31, fatPer100g: 3.6, carbsPer100g: 0, fiberPer100g: 0 },
  { name: 'Індичка', category: 'protein', caloriesPer100g: 135, proteinPer100g: 29, fatPer100g: 1.5, carbsPer100g: 0, fiberPer100g: 0 },
  { name: 'Яловичина пісна', category: 'protein', caloriesPer100g: 170, proteinPer100g: 26, fatPer100g: 7, carbsPer100g: 0, fiberPer100g: 0 },
  { name: 'Лосось', category: 'protein', caloriesPer100g: 208, proteinPer100g: 20, fatPer100g: 13, carbsPer100g: 0, fiberPer100g: 0 },
  { name: 'Тунець у власному соку', category: 'protein', caloriesPer100g: 116, proteinPer100g: 26, fatPer100g: 1, carbsPer100g: 0, fiberPer100g: 0 },
  { name: 'Яйце куряче', category: 'mixed', caloriesPer100g: 155, proteinPer100g: 13, fatPer100g: 11, carbsPer100g: 1.1, fiberPer100g: 0 },
  { name: 'Сир кисломолочний 5%', category: 'protein', caloriesPer100g: 121, proteinPer100g: 17, fatPer100g: 5, carbsPer100g: 2.8, fiberPer100g: 0 },
  { name: 'Грецький йогурт', category: 'mixed', caloriesPer100g: 95, proteinPer100g: 9, fatPer100g: 4, carbsPer100g: 4, fiberPer100g: 0 },
  { name: 'Молоко 2.5%', category: 'drink', caloriesPer100g: 52, proteinPer100g: 2.8, fatPer100g: 2.5, carbsPer100g: 4.7, fiberPer100g: 0 },
  { name: 'Кефір 1%', category: 'drink', caloriesPer100g: 40, proteinPer100g: 3, fatPer100g: 1, carbsPer100g: 4, fiberPer100g: 0 },
  { name: 'Вівсянка суха', category: 'carb', caloriesPer100g: 365, proteinPer100g: 13, fatPer100g: 7, carbsPer100g: 62, fiberPer100g: 10 },
  { name: 'Гречка суха', category: 'carb', caloriesPer100g: 343, proteinPer100g: 13.3, fatPer100g: 3.4, carbsPer100g: 71.5, fiberPer100g: 10 },
  { name: 'Рис білий сухий', category: 'carb', caloriesPer100g: 360, proteinPer100g: 7, fatPer100g: 0.6, carbsPer100g: 79, fiberPer100g: 1.3 },
  { name: 'Картопля', category: 'carb', caloriesPer100g: 77, proteinPer100g: 2, fatPer100g: 0.1, carbsPer100g: 17, fiberPer100g: 2.2 },
  { name: 'Макарони твердих сортів (сухі)', category: 'carb', caloriesPer100g: 350, proteinPer100g: 12, fatPer100g: 1.5, carbsPer100g: 70, fiberPer100g: 3 },
  { name: 'Хліб цільнозерновий', category: 'carb', caloriesPer100g: 247, proteinPer100g: 13, fatPer100g: 4.2, carbsPer100g: 41, fiberPer100g: 7 },
  { name: 'Банан', category: 'fruit', caloriesPer100g: 89, proteinPer100g: 1.1, fatPer100g: 0.3, carbsPer100g: 23, fiberPer100g: 2.6 },
  { name: 'Яблуко', category: 'fruit', caloriesPer100g: 52, proteinPer100g: 0.3, fatPer100g: 0.2, carbsPer100g: 14, fiberPer100g: 2.4 },
  { name: 'Апельсин', category: 'fruit', caloriesPer100g: 47, proteinPer100g: 0.9, fatPer100g: 0.1, carbsPer100g: 12, fiberPer100g: 2.4 },
  { name: 'Полуниця', category: 'fruit', caloriesPer100g: 32, proteinPer100g: 0.7, fatPer100g: 0.3, carbsPer100g: 7.7, fiberPer100g: 2 },
  { name: 'Авокадо', category: 'fat', caloriesPer100g: 160, proteinPer100g: 2, fatPer100g: 14.7, carbsPer100g: 8.5, fiberPer100g: 6.7 },
  { name: 'Оливкова олія', category: 'fat', caloriesPer100g: 884, proteinPer100g: 0, fatPer100g: 100, carbsPer100g: 0, fiberPer100g: 0 },
  { name: 'Арахісова паста', category: 'fat', caloriesPer100g: 588, proteinPer100g: 25, fatPer100g: 50, carbsPer100g: 20, fiberPer100g: 6 },
  { name: 'Мигдаль', category: 'fat', caloriesPer100g: 579, proteinPer100g: 21, fatPer100g: 50, carbsPer100g: 22, fiberPer100g: 12 },
  { name: 'Волоський горіх', category: 'fat', caloriesPer100g: 654, proteinPer100g: 15, fatPer100g: 65, carbsPer100g: 14, fiberPer100g: 7 },
  { name: 'Броколі', category: 'vegetable', caloriesPer100g: 34, proteinPer100g: 2.8, fatPer100g: 0.4, carbsPer100g: 6.6, fiberPer100g: 2.6 },
  { name: 'Огірок', category: 'vegetable', caloriesPer100g: 15, proteinPer100g: 0.7, fatPer100g: 0.1, carbsPer100g: 3.6, fiberPer100g: 0.5 },
  { name: 'Помідор', category: 'vegetable', caloriesPer100g: 18, proteinPer100g: 0.9, fatPer100g: 0.2, carbsPer100g: 3.9, fiberPer100g: 1.2 },
  { name: 'Морква', category: 'vegetable', caloriesPer100g: 41, proteinPer100g: 0.9, fatPer100g: 0.2, carbsPer100g: 10, fiberPer100g: 2.8 },
  { name: 'Твердий сир', category: 'mixed', caloriesPer100g: 380, proteinPer100g: 24, fatPer100g: 30, carbsPer100g: 1.5, fiberPer100g: 0 }
];

async function run() {
  await connectDatabase();
  const foodRepository = new FoodRepository();

  for (const item of defaults) {
    await foodRepository.upsertDefaultFood(item);
  }

  console.log(`Seed done: ${defaults.length} food items`);
  await closeDatabase();
}

run().catch(async (error) => {
  console.error(error);
  await closeDatabase();
  process.exit(1);
});
