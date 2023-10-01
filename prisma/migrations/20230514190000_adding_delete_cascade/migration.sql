-- DropForeignKey
ALTER TABLE `categorytoarticle` DROP FOREIGN KEY `CategoryToArticle_articleId_fkey`;

-- DropForeignKey
ALTER TABLE `categorytoarticle` DROP FOREIGN KEY `CategoryToArticle_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_articleId_fkey`;

-- AddForeignKey
ALTER TABLE `CategoryToArticle` ADD CONSTRAINT `CategoryToArticle_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CategoryToArticle` ADD CONSTRAINT `CategoryToArticle_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
