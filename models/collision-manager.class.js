/**
 * @fileoverview Collision Manager class that handles all collision detection in the game world.
 * Manages bottle-enemy collisions, collectible pickups, and character-enemy interactions.
 * 
 * @version 1.0.0
 * @author Daniel Grabowski
 * @since 2024
 */

/**
 * Manages all collision detection logic for the game world.
 * Separates collision handling into specific methods for different collision types.
 * 
 * @class
 */
class CollisionManager {
    /** @type {World} Reference to the world instance */
    world;

    /**
     * Creates a new CollisionManager instance.
     * 
     * @constructor
     * @param {World} world - The world instance to manage collisions for
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Handles all collision detection in the game world.
     * Delegates to specific collision handlers for different types.
     * 
     * @method
     * @returns {void}
     */
    checkAllCollisions() {
        this.checkBottleEnemyCollisions();
        this.checkBottleCollections();
        this.checkCoinCollections();
        this.checkCharacterEnemyCollisions();
    }

    /**
     * Handles collisions between thrown bottles and enemies.
     * Manages damage dealing and bottle removal after collision.
     * 
     * @method
     * @returns {void}
     */
    checkBottleEnemyCollisions() {
        this.world.throwableObjects.forEach((bottle, bottleIndex) => {
            if (bottle.hasCollided) return;
            this.world.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy)) {
                    this.handleBottleEnemyHit(bottle, enemy, bottleIndex);
                }
            });
        });
    }

    /**
     * Processes a bottle hitting an enemy.
     * Handles damage, positioning, and animation setup.
     * 
     * @method
     * @param {ThrowableObject} bottle - The bottle that hit
     * @param {MovableObject} enemy - The enemy that was hit
     * @param {number} bottleIndex - Index of bottle in array
     * @returns {void}
     */
    handleBottleEnemyHit(bottle, enemy, bottleIndex) {
        console.log('Flasche trifft Gegner:', enemy);
        bottle.hasCollided = true;
        clearInterval(bottle.throwInterval);
        bottle.speedY = 0;
        bottle.x = enemy.x + enemy.width / 2 - bottle.width / 2;
        bottle.y = enemy.y + enemy.height / 2 - bottle.height / 2;
        this.applyEnemyDamage(enemy);
        bottle.startSplashAnimation();
        this.scheduleBottleRemoval(bottle, bottleIndex);
    }

    /**
     * Applies damage to an enemy based on its type.
     * Handles special logic for Endboss vs regular enemies.
     * 
     * @method
     * @param {MovableObject} enemy - The enemy to damage
     * @returns {void}
     */
    applyEnemyDamage(enemy) {
        if (enemy instanceof Endboss) {
            enemy.health -= 20;
            this.world.statusBarEndboss.setPercentage(enemy.health);
            if (enemy.health <= 0) {
                enemy.isKO = true;
            }
        } else {
            enemy.isKO = true;
            enemy.speed = 0;
            enemy.applyGravity = () => {};
        }
    }

    /**
     * Schedules removal of a bottle after splash animation.
     * Uses setTimeout to delay removal until animation completes.
     * 
     * @method
     * @param {ThrowableObject} bottle - The bottle to remove
     * @param {number} bottleIndex - Index of bottle in array
     * @returns {void}
     */
    scheduleBottleRemoval(bottle, bottleIndex) {
        setTimeout(() => {
            if (this.world.throwableObjects.includes(bottle)) {
                console.log('Entferne Flasche nach Splash-Animation:', bottle);
                this.world.throwableObjects.splice(bottleIndex, 1);
            }
        }, bottle.IMAGES_SPLASH.length * 100);
    }

    /**
     * Handles collection of bottle pickups by the character.
     * Updates bottle status bar and plays collection sound.
     * 
     * @method
     * @returns {void}
     */
    checkBottleCollections() {
        this.world.level.bottles.forEach((bottle, index) => {
            if (this.world.character.isCollidingForCollecting(bottle)) {
                if (this.world.statusBarBottles.percentage < 100) {
                    this.world.level.bottles.splice(index, 1);
                    this.world.updateBottleStatusBar();
                    this.world.soundBottleCollect.play();
                    this.world.soundBottleCollect.volume = 0.3;
                }
            }
        });
    }

    /**
     * Handles collection of coin pickups by the character.
     * Updates coin status bar and plays collection sound.
     * 
     * @method
     * @returns {void}
     */
    checkCoinCollections() {
        this.world.level.coins.forEach((coin, index) => {
            if (this.world.character.isCollidingForCollecting(coin)) {
                if (this.world.statusBarCoins.percentage < 100) {
                    this.world.level.coins.splice(index, 1);
                    this.world.updateCoinStatusBar();
                    this.world.soundCoinCollect.play();
                    this.world.soundCoinCollect.volume = 0.3;
                }
            }
        });
    }

    /**
     * Handles collisions between character and enemies.
     * Includes jump attack logic and regular damage dealing.
     * 
     * @method
     * @returns {void}
     */
    checkCharacterEnemyCollisions() {
        let successfulJumpAttack = false;
        let enemiesToRemove = [];
        
        this.world.level.enemies.forEach(enemy => {
            if (this.world.character.isColliding(enemy)) {
                if (this.isValidJumpAttack(enemy)) {
                    this.executeJumpAttack(enemy, enemiesToRemove);
                    successfulJumpAttack = true;
                }
            }
        });
        
        if (successfulJumpAttack) {
            this.world.character.speedY = 8;
            this.world.character.setJumpAttackInvulnerability();
            this.scheduleEnemyRemoval(enemiesToRemove);
        } else if (!this.world.character.isInvulnerableAfterJumpAttack() && !this.world.character.isHurt()) {
            this.checkRegularEnemyDamage();
        }
    }

    /**
     * Checks if a jump attack is valid for the given enemy.
     * Validates enemy type, character speed, and collision positioning.
     * 
     * @method
     * @param {MovableObject} enemy - The enemy to check
     * @returns {boolean} Whether jump attack is valid
     */
    isValidJumpAttack(enemy) {
        return (enemy instanceof Chicken || enemy instanceof ChickenSmall) &&
               this.world.character.speedY < -5 &&
               this.world.character.y + this.world.character.height - this.world.character.offset.bottom >= enemy.y + enemy.offset.top &&
               this.world.character.y + this.world.character.height - this.world.character.offset.bottom <= enemy.y + enemy.offset.top + 30 &&
               this.world.character.x + this.world.character.offset.left < enemy.x + enemy.width - enemy.offset.right &&
               this.world.character.x + this.world.character.width - this.world.character.offset.right > enemy.x + enemy.offset.left &&
               !this.world.character.isInvulnerableAfterJumpAttack();
    }

    /**
     * Executes a successful jump attack on an enemy.
     * Plays sound effect and marks enemy for removal.
     * 
     * @method
     * @param {MovableObject} enemy - The enemy to attack
     * @param {MovableObject[]} enemiesToRemove - Array to add enemy to
     * @returns {void}
     */
    executeJumpAttack(enemy, enemiesToRemove) {
        console.log('Charakter trifft das Huhn von oben:', enemy);
        enemy.isKO = true;
        enemy.speed = 0;
        this.world.chickenKOSound.play();
        this.world.chickenKOSound.volume = 0.1;
        enemiesToRemove.push(enemy);
    }

    /**
     * Schedules removal of defeated enemies after a delay.
     * Removes enemies from the level after 1 second.
     * 
     * @method
     * @param {MovableObject[]} enemiesToRemove - Array of enemies to remove
     * @returns {void}
     */
    scheduleEnemyRemoval(enemiesToRemove) {
        if (enemiesToRemove.length > 0) {
            setTimeout(() => {
                enemiesToRemove.forEach(enemyToRemove => {
                    const index = this.world.level.enemies.indexOf(enemyToRemove);
                    if (index > -1) {
                        this.world.level.enemies.splice(index, 1);
                    }
                });
            }, 1000);
        }
    }

    /**
     * Checks for regular enemy damage when no jump attack occurs.
     * Applies damage to character if colliding with any enemy.
     * 
     * @method
     * @returns {void}
     */
    checkRegularEnemyDamage() {
        this.world.level.enemies.forEach(enemy => {
            if (this.world.character.isColliding(enemy)) {
                this.world.character.hit();
                this.world.statusBar.setPercentage(this.world.character.energy);
                return;
            }
        });
    }
}
