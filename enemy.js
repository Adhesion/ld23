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
        
        this.setVelocity( 2.5, 7.0 );
        this.gravity = 0.5;
        
        this.updateColRect( 8, 32, -1 );
        
        this.collidable = true;
        this.type = me.game.ENEMY_OBJECT;
        
        this.addAnimation( "idle", [0] );
        this.addAnimation( "jump", [1] );
        this.addAnimation( "grab", [2] );
        this.addAnimation( "run", [3, 4, 5, 6] );
        
        this.isAttached = false;
        this.attachMax = 100;
        this.attachCounter = this.attachMax;
        this.attachRate = 2;
        this.posDiffX = 0;
        this.posDiffY = 0;
    },
    
    decrementAttachCounter: function( amt )
    {
        this.attachCounter -= amt;
    },
    
    onCollision: function( res, obj )
    {
        if ( obj == me.game.player )
        {
            if ( res.y > 0 )
            {
                // kill enemies on stomp? may change later
                this.alive = false;
                me.game.remove( this );
            }
            else
            {
                this.isAttached = true;
                this.posDiffX = me.game.player.pos.x - this.pos.x;
                this.posDiffY = me.game.player.pos.y - this.pos.y;
                this.collidable = false;
                me.game.player.addAttached( this );
            }
        }
    },

    update: function()
    {
        if ( !this.visible )
        {
            return false;
        }

        if ( this.isAttached )
        {
            this.setCurrentAnimation( "grab" );
            this.pos.x = me.game.player.pos.x - this.posDiffX;
            this.pos.y = me.game.player.pos.y - this.posDiffY;
            this.vel.x = 0;
            this.vel.y = 0;
            
            if ( this.attachCounter > 0 )
            {
                this.attachCounter--;
            }
            else
            {
                this.isAttached = false;
                me.game.player.removeAttached( this.GUID );
                this.flicker( this.attachMax / this.attachRate );
            }
        }
        else
        {
            this.setCurrentAnimation( "run" );
            this.doWalk( me.game.player.pos.x < this.pos.x );
            
            // add random jump if "close"
            if ( Math.abs( me.game.player.pos.x - this.pos.x ) < 60 && Math.random() > 0.95 )
            {
                this.doJump();
            }
            
            // add a delay after deattach wherein the enemy can't collide with player
            if ( this.attachCounter < this.attachMax )
            {
                this.attachCounter += this.attachRate;
                this.vel.x = -5.0;
            }
            else
            {
                this.collidable = true;
            }
        }
        
        if ( ( this.falling || this.jumping ) && !this.attached )
        {
            this.setCurrentAnimation( "jump" );
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
