/**
 * @fileoverview Audio Manager class that handles all audio operations in the game.
 * Manages background music, sound effects, muting, and audio initialization.
 * 
 * @version 1.0.0
 * @author Daniel Grabowski
 * @since 2024
 */

/**
 * Manages all audio operations for the game world.
 * Handles centralized mute control, background music, and sound effects.
 * 
 * @class
 */
class AudioManager {
    /** @type {World} Reference to the world instance */
    world;
    /** @type {Audio[]} Array containing all audio objects for mute control */
    allAudioObjects = [];

    /**
     * Creates a new AudioManager instance.
     * 
     * @constructor
     * @param {World} world - The world instance to manage audio for
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Initializes all audio objects for centralized mute control.
     * Collects character sounds, enemy sounds, and world sounds.
     * 
     * @method
     * @returns {void}
     */
    initAudioObjects() {
        this.collectWorldAudioObjects();
        this.collectCharacterAudioObjects();
        this.collectEnemyAudioObjects();
    }

    /**
     * Collects world-specific audio objects.
     * Includes background music and world sound effects.
     * 
     * @method
     * @returns {void}
     */
    collectWorldAudioObjects() {
        this.allAudioObjects.push(
            this.world.backgroundMusic,
            this.world.chickenKOSound,
            this.world.soundBottleCollect,
            this.world.soundCoinCollect
        );
    }

    /**
     * Collects character-specific audio objects.
     * Includes all character sounds and actions.
     * 
     * @method
     * @returns {void}
     */
    collectCharacterAudioObjects() {
        this.allAudioObjects.push(
            this.world.character.jumpSound,
            this.world.character.stepSound,
            this.world.character.hurtSound,
            this.world.character.snorSound,
            this.world.character.idleSound,
            this.world.character.deadSound
        );
    }

    /**
     * Collects enemy-specific audio objects.
     * Includes special handling for Endboss audio.
     * 
     * @method
     * @returns {void}
     */
    collectEnemyAudioObjects() {
        this.world.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                this.allAudioObjects.push(
                    enemy.bossSound,
                    enemy.bossDeadSound,
                    enemy.winnerSound
                );
            }
        });
    }

    /**
     * Initializes and starts the background music.
     * Sets up looping, volume, and mute state from localStorage.
     * 
     * @method
     * @returns {void}
     */
    initBackgroundMusic() {
        this.createBackgroundMusic();
        this.configureBackgroundMusic();
        this.applyMuteSettings();
        this.startBackgroundMusic();
    }

    /**
     * Creates the background music audio object.
     * Sets the audio source file.
     * 
     * @method
     * @returns {void}
     */
    createBackgroundMusic() {
        this.world.backgroundMusic = new Audio('./audio/background_game_2.mp3');
    }

    /**
     * Configures background music properties.
     * Sets looping and volume settings.
     * 
     * @method
     * @returns {void}
     */
    configureBackgroundMusic() {
        this.world.backgroundMusic.loop = true;
        this.world.backgroundMusic.volume = 0.5;
    }

    /**
     * Applies mute settings from localStorage to all audio.
     * Checks stored mute preference and applies to all objects.
     * 
     * @method
     * @returns {void}
     */
    applyMuteSettings() {
        const muted = localStorage.getItem('muted') === '1';
        this.world.backgroundMusic.muted = muted;
        this.allAudioObjects.forEach(audio => {
            if (audio) {
                audio.muted = muted;
            }
        });
    }

    /**
     * Starts playing the background music.
     * Begins audio playback after configuration.
     * 
     * @method
     * @returns {void}
     */
    startBackgroundMusic() {
        this.world.backgroundMusic.play().catch(error => {
            // Ignore AbortError when play() is interrupted by pause()
        });
    }

    /**
     * Toggles mute state for all audio objects.
     * Updates localStorage and applies to all game audio.
     * 
     * @method
     * @returns {void}
     */
    toggleMute() {
        const newMuted = this.calculateNewMuteState();
        this.updateMutePreference(newMuted);
        this.applyMuteToAllAudio(newMuted);
        this.refreshAudioObjectsList();
        this.applyMuteToRefreshedList(newMuted);
    }

    /**
     * Calculates the new mute state based on current state.
     * Inverts the current mute status.
     * 
     * @method
     * @returns {boolean} The new mute state
     */
    calculateNewMuteState() {
        const isMuted = this.world.backgroundMusic.muted;
        return !isMuted;
    }

    /**
     * Updates the mute preference in localStorage.
     * Stores the new mute setting for persistence.
     * 
     * @method
     * @param {boolean} newMuted - The new mute state
     * @returns {void}
     */
    updateMutePreference(newMuted) {
        localStorage.setItem('muted', newMuted ? '1' : '0');
    }

    /**
     * Applies mute state to all DOM audio elements.
     * Finds and mutes all audio elements in the document.
     * 
     * @method
     * @param {boolean} newMuted - The new mute state
     * @returns {void}
     */
    applyMuteToAllAudio(newMuted) {
        const allAudioElements = document.querySelectorAll('audio');
        allAudioElements.forEach(audio => {
            audio.muted = newMuted;
        });
    }

    /**
     * Refreshes the list of all audio objects.
     * Rebuilds the complete audio objects array.
     * 
     * @method
     * @returns {void}
     */
    refreshAudioObjectsList() {
        this.allAudioObjects = [
            this.world.backgroundMusic,
            this.world.chickenKOSound,
            this.world.soundBottleCollect,
            this.world.soundCoinCollect,
            this.world.character.jumpSound,
            this.world.character.stepSound,
            this.world.character.hurtSound,
            this.world.character.snorSound,
            this.world.character.idleSound,
            this.world.character.deadSound
        ];
        this.addEnemyAudioToList();
        this.addThrowableAudioToList();
    }

    /**
     * Adds enemy audio objects to the refreshed list.
     * Includes Endboss audio if present.
     * 
     * @method
     * @returns {void}
     */
    addEnemyAudioToList() {
        this.world.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) {
                this.allAudioObjects.push(
                    enemy.bossSound,
                    enemy.bossDeadSound,
                    enemy.winnerSound
                );
            }
        });
    }

    /**
     * Adds throwable object audio to the refreshed list.
     * Includes bottle breaking sounds.
     * 
     * @method
     * @returns {void}
     */
    addThrowableAudioToList() {
        this.world.throwableObjects.forEach(bottle => {
            if (bottle.soundBrokenBottle) {
                this.allAudioObjects.push(bottle.soundBrokenBottle);
            }
        });
    }

    /**
     * Applies mute state to the refreshed audio list.
     * Ensures all audio objects have the correct mute state.
     * 
     * @method
     * @param {boolean} newMuted - The new mute state
     * @returns {void}
     */
    applyMuteToRefreshedList(newMuted) {
        this.allAudioObjects.forEach(audio => {
            if (audio) {
                audio.muted = newMuted;
            }
        });
    }

    /**
     * Stops and mutes all audio objects.
     * Used when the game ends to silence all sounds.
     * 
     * @method
     * @returns {void}
     */
    stopAllAudio() {
        this.allAudioObjects.forEach(audio => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
                audio.muted = true;
            }
        });
        if (this.world.backgroundMusic) {
            this.world.backgroundMusic.pause();
        }
    }
}
