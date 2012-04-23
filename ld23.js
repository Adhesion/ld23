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

        me.entityPool.add( "player", Player );
        me.entityPool.add( "enemy", Enemy );

        me.debug.renderHitBox = true;

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
    },

    showStoryText: function( text ) {
        this.storyDisplay.setText( text );
    },

    changeLevel: function( l ) {
        this.levelDisplay.reset();
    },

    getLevel: function() {
        var level = me.levelDirector.getCurrentLevelId();
        var re = /level(\d+)/;
        var results = re.exec(level);
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
    },

    restartLevel: function( level ) {
        this.levelDisplay.reset();
        level = level || me.levelDirector.getCurrentLevelId();
        me.levelDirector.loadLevel( level );
        me.game.sort();
    },

    onDestroyEvent: function()
    {
 
    }
});

var TitleScreen = me.ScreenObject.extend({
    init: function() {
        this.parent( true );
    },

    onResetEvent: function() {
        if( ! this.title ) {
            this.splash= me.loader.getImage("splash");
            this.cta = me.loader.getImage("splash_cta");
            this.title = me.loader.getImage("splash_title");
        }

        me.input.bindKey( me.input.KEY.ENTER, "enter", true );
    },
    update: function() {
        if( me.input.isKeyPressed('enter')) {
            me.state.change(me.state.PLAY);
        }
    },
    draw: function(context) {
        context.drawImage( this.splash, 0, 0 );
        context.drawImage( this.title, 50, 150 );
        context.drawImage( this.cta, 200, 400 );
    },
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
    }
});

window.onReady( function()
{
    jsApp.onload();
});
