/*
 * hud.js
 * 
 * Defines various HUD classes.
 *
 * Author: Andrew Ford
 */

var HPDisplay = me.HUD_Item.extend(
{
    init: function( x, y )
    {	
		this.livesIcon = me.loader.getImage("hud_lives");
		this.hpIcon = me.loader.getImage("hud_hp");
        this.parent( x, y );
        this.font = new me.BitmapFont( "16x16_font", 16 );
		this.font.set("left", 1); 
    },
    
    draw: function( context, x, y )
    {
	context.drawImage( this.livesIcon, this.pos.x + x, this.pos.y + y - 4 );
        this.font.draw( context, me.game.lives, this.pos.x + x + 48, this.pos.y + y );
        
        context.drawImage( this.hpIcon, this.pos.x + x + 80, this.pos.y + y - 3 );
        this.font.draw( context, this.value + "%", this.pos.x + x + 110, this.pos.y + y );
	
    }
});

var TemporaryDisplay = me.HUD_Item.extend({
    init: function( x, y, settings ) {
        settings = settings || {};
        this.parent( x, y, settings );
        this.font = settings.font || new me.BitmapFont( "32x32_font", 32 );
		this.font.set("left", 1); 
    },

    /** Resets the level value to default value and the timer to 0 */
    reset: function() {
        this.parent();
        this.start = false;
    },

    /** This should be overwritten. */
    getText: function() {
        return '';
    },

    /** Draws the level display if the timer hasn't expired.
     * TODO: Possible performance tweak would be to cache timer expire. */
    draw: function( context, x, y )
    {
        if( ! this.start ) {
            this.start = me.timer.getTime();
        }

        if( me.timer.getTime() - this.start < 2000 ) {
            this.font.draw(
                context,
                this.getText().toUpperCase(),
                this.pos.x + x,
                this.pos.y + y
            );
        }
    }
});

var StoryDisplay = TemporaryDisplay.extend({
    init: function() {
        this.parent( 50, 100, {
            font: new me.BitmapFont( "16x16_font", 16),
        });
        this.text = '';
    },
    setText: function( text ) {
        this.reset();
        this.text = text;
    },
    getText: function () {
        return this.text;
    }
});

var LevelDisplay = TemporaryDisplay.extend({
    init: function( )
    {
        this.parent( 50, me.video.getHeight() *0.75, {
            font: new me.BitmapFont( "64x64_font", 64),
        } );
    },
    getText: function() {
        return "LEVEL " + me.state.current().getLevel();
    }
});
