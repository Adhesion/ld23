/*
 * enemy.js
 * 
 * Defines the enemies.
 *
 * Author: Andrew Ford
 */

var Enemy = me.ObjectEntity.extend(
{
    init: function( x, y, settings )
    {
        this.parent( x, y, settings );
        
        this.setVelocity( 2.5, 5.0 );
        
        this.collidable = true;
        this.type = me.game.ENEMY_OBJECT;
        
        this.isAttached = false;
    },
    
    onCollision: function( res )
    {
        alert( "enemy collide" );
        this.isAttached = true;
    },

    update: function()
    {
        //alert( me.game.player.pos.x );
        //alert( this.pos.x );
        if ( this.isAttached )
        {
            this.vel = me.game.player.vel;
        }
        else
        {
            this.doWalk( me.game.player.pos.x < this.pos.x );
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