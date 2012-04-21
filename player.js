/*
 * player.js
 * 
 * Defines the player robot.
 *
 * Author: Andrew Ford
 */

var Player = me.ObjectEntity.extend(
{
    init: function( x, y, settings )
    {
        this.parent( x, y, settings );
        
        this.setVelocity( 4.0, 10.0 );
        this.gravity = 0.5;
        this.setFriction( 0.2, 0.2 );
        
        this.collidable = true;
        
        me.game.viewport.follow( this.pos, me.game.viewport.AXIS.BOTH );
        
        me.input.bindKey( me.input.KEY.LEFT, "left" );
        me.input.bindKey( me.input.KEY.RIGHT, "right" );
        me.input.bindKey( me.input.KEY.X, "jump", true );
        me.input.bindKey( me.input.KEY.C, "shoot" );
        
        me.game.player = this;
    },
    
    update: function()
    {
        if ( me.input.isKeyPressed( "left" ) )
        {
            this.doWalk( true );
        }
        else if ( me.input.isKeyPressed( "right" ) )
        {
            this.doWalk( false );
        }
        
        if ( me.input.isKeyPressed( "jump" ) )
        {
            this.doJump();
        }
        
        var res = this.updateMovement();
        
        if ( this.vel.x != 0 || this.vel.y != 0 )
        {
            this.parent( this );
            return true;
        }        
        return false;
    }
});
