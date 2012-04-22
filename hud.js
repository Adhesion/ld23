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

var LevelDisplay = me.HUD_Item.extend(
{
    init: function( )
    {
        var x = me.video.getWidth() / 2;
        var y = me.video.getHeight() / 2;
        this.parent( x, y );
        this.font = new me.BitmapFont( "32x32_font", 32 );
        this.reset();
    },

    /** Resets the level value to default value and the timer to 0 */
    reset: function() {
        this.parent();
        this.start = false;
    },

    /** Draws the level display if the timer hasn't expired.
     * TODO: Possible performance tweak would be to cache timer expire. */
    draw: function( context, x, y )
    {
        if( ! this.start ) {
            this.start = me.timer.getTime();
        }

        if( me.timer.getTime() - this.start < 2000 ) {
            var level = me.state.current().getLevel();
            this.font.draw( context, "LEVEL " + level, this.pos.x + x, this.pos.y + y );
        }
    }
});
