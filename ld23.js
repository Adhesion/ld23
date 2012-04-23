/*
 * ld23.js
 * 
 * Main file for LD23 entry.
 *
 * Author: Andrew Ford
 */

var jsApp =
{
    onload: function()
    {
        if ( !me.video.init( 'game', 640, 480 ) )
        {
            alert( "Sorry, it appears your browser does not support HTML5 canvas." );
            return;
        }

        me.audio.init( "mp3,ogg" );

        me.loader.onload = this.loaded.bind( this );

        me.loader.preload( gameResources );

        me.state.change( me.state.LOADING );
    },
    
    loaded: function()
    {

        me.state.set( me.state.PLAY, new PlayScreen() );
        me.state.set( me.state.MENU, new TitleScreen() );
        me.state.set( me.state.GAMEOVER, new GameOverScreen() );

        me.entityPool.add( "player", Player );
        me.entityPool.add( "enemy", Enemy );

        me.debug.renderHitBox = false;

        me.state.change( me.state.MENU );

    }
}

var LevelChanger = me.LevelEntity.extend({
    init: function( x, y, settings ) {
        this.parent( x, y, settings );
    },
    goTo: function ( level ) {
        this.parent( level );
        me.state.current().changeLevel( this.gotolevel );
    }
});

var StoryNode = me.InvisibleEntity.extend(
{
    init: function( x, y, settings )
    {
        this.parent( x, y, settings );
        this.text = settings.text;
        this.toggled = false;
    },
    
    // only check collision with player, & only first time - prevents other stuff from hitting it & not other things (no multiple collision)
    checkCollision: function( obj )
    {
        if ( obj == me.game.player && !this.toggled )
        {
            return this.parent( obj );
        }
        return null;
    },
    
    onCollision: function()
    {
        if( ! this.toggled )
        {
            me.state.current().showStoryText( this.text );
            this.toggled = true;
        }
    }
});

var PlayScreen = me.ScreenObject.extend(
{

    init: function () {
        me.entityPool.add("LevelChanger", LevelChanger);
        me.entityPool.add("StoryNode", StoryNode);
        this.levelDisplay = new LevelDisplay();
        this.storyDisplay = new StoryDisplay();
        me.game.lives = 5;
        me.game.kills = 0;
    },

    showStoryText: function( text ) {
        this.storyDisplay.setText( text );
    },

    changeLevel: function( l ) {
        this.levelDisplay.reset();
        var levelNum = this.parseLevel( l );
        if ( levelNum == 3 )
        {
            me.audio.stopTrack();
            me.audio.playTrack( "ld23-air" );
        }
        else if ( levelNum == 6 )
        {
            me.audio.stopTrack();
            me.audio.playTrack( "ld23-space" );
        }
    },

    getLevel: function() {
        return this.parseLevel( me.levelDirector.getCurrentLevelId() );
    },
    
    parseLevel: function( input )
    {
        var re = /level(\d+)/;
        var results = re.exec( input );
        return results[1];
    },

    onResetEvent: function()
    {
        // stuff to reset on state change
        me.game.addHUD( 0, 0, me.video.getWidth(), me.video.getHeight() );
        me.game.HUD.addItem( "hp", new HPDisplay( 620, 0 ) );
        me.game.HUD.addItem( "levelDisplay", this.levelDisplay );
        me.game.HUD.addItem( "storyDisplay", this.storyDisplay );
        this.restartLevel(location.hash.substr(1));
        me.audio.playTrack( "ld23-mars" );
    },

    restartLevel: function( level ) {
        this.levelDisplay.reset();
        level = level || me.levelDirector.getCurrentLevelId();
        me.levelDirector.loadLevel( level );
        me.game.sort();
    },

    onDestroyEvent: function()
    {
        me.game.disableHUD();
        me.audio.stopTrack();
    }
});

var TitleScreen = me.ScreenObject.extend({
    init: function() {
        this.parent( true );
        this.counter = 480;
    },

    onResetEvent: function() {
        if( ! this.title ) {
            this.splash= me.loader.getImage("splash");
            this.cta = me.loader.getImage("splash_cta");
            this.title = me.loader.getImage("splash_title");
        }

        me.input.bindKey( me.input.KEY.ENTER, "enter", true );
        me.audio.playTrack( "ld23-theme" );
    },

    update: function() {
        if( me.input.isKeyPressed('enter')) {
            me.state.change(me.state.PLAY);
        }
        if ( this.counter > 0 )
        {
            this.counter--;
        }
        // have to force redraw :(
        me.game.repaint();
    },

    draw: function(context) {
        context.drawImage( this.splash, 0, 0 );
        context.drawImage( this.title, 50, 290 + ( this.counter / 5.85 ) );
        if ( this.counter == 0 )
        {
            context.drawImage( this.cta, 200, 420 );
        }
    },

    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
        me.audio.stopTrack();
    }
});

var GameOverScreen = me.ScreenObject.extend(
{
    init: function()
    {
        this.parent( true );
    },
    
    onResetEvent: function()
    {
        if ( !this.background )
        {
            this.font = new me.BitmapFont( "16x16_font", 16 );
            this.background = me.loader.getImage( "end_background" );
            this.great = me.loader.getImage( "end_great" );
            this.terrible = me.loader.getImage( "end_terrible" );
        }
        me.audio.playTrack( "ld23-theme" );
    },
    
    draw: function( context, x, y )
    {
        context.drawImage( this.background, 0, 0 );
        context.drawImage( me.game.lives >= 0 ? this.great : this.terrible, me.game.lives >= 0 ? 200 : 130, 50 );

        var text = new Array();

        if ( me.game.kills == 0 )
        {
            text[0] = "PERFECT!! HAIL OUR ROBOT LORD";
            text[1] = "AND SAVIOR! HAIL! O HAPPY DAY";
        }
        else if ( me.game.kills < 10 )
        {
            text[0] = "COULD'VE BEEN AN ACCIDENT.";
            text[1] = "WELL, A FEW ACCIDENTS.";
            text[2] = "YOU KNOW WHAT I MEAN.";
        }
        else
        {
            text[0] = "YOU'RE AN INHUMAN MONSTER!!";
        }

        var killString = "KILLS: " + me.game.kills;
        this.font.draw( context, killString, 620, 350 );

        for ( var i = 0; i < text.length; i++ )
        {
            //var string = text[i];
            //console.log( string );
            this.font.draw( context, text[i], 620, 400 + ( i * 20 ) );
        }
    }
});

window.onReady( function()
{
    jsApp.onload();
});
