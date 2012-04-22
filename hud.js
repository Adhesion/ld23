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
        this.parent( x, y );
        this.font = new me.BitmapFont( "32x32_font", 32 );
    },
    
    draw: function( context, x, y )
    {
        this.font.draw( context, "HP: " + this.value, this.pos.x + x, this.pos.y + y );
    }
});

var TemporaryDisplay = me.HUD_Item.extend({
    init: function( x, y, settings ) {
        this.parent( x, y, settings );
        this.font = new me.BitmapFont( "32x32_font", 32 );
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
        this.parent( 600, 100 );
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
        var x = me.video.getWidth() / 2;
        var y = me.video.getHeight() / 2;
        this.parent( x, y );
    },
    getText: function() {
        return "LEVEL " + me.state.current().getLevel();
    }
});
