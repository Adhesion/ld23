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
        
        this.setVelocity( 5.0, 14.0 );
        this.gravity = 0.5;
        this.setFriction( 0.2, 0.1 );
        
        this.updateColRect( 36, 72, -1 );
        
        this.lastWalkLeft = false;
        this.curWalkLeft = false;
        
        this.attachedList = new Array();
        
        this.collidable = true;
        
        this.lastCamX = me.game.viewport.pos.x;
        
        this.hp = 100;
        this.hpCounter = 0;
        this.hpCounterMax = 30;
        
        this.addAnimation( "idle", [ 0 ] );
        this.addAnimation( "jump", [ 1 ] );
        this.addAnimation( "run", [ 2, 3, 4, 5 ] );
        
        this.curFlame = null;
        this.curLaser = null;
        
        this.followPos = new me.Vector2d( this.pos.x, this.pos.y + 32 );

        me.game.viewport.follow( this.followPos, me.game.viewport.AXIS.BOTH );
        me.game.viewport.setDeadzone( me.game.viewport.width / 10, 1 );

        me.input.bindKey( me.input.KEY.LEFT, "left" );
        me.input.bindKey( me.input.KEY.RIGHT, "right" );
        me.input.bindKey( me.input.KEY.X, "jump", true );
        me.input.bindKey( me.input.KEY.C, "shoot" );
        
        me.game.player = this;
    },
    
    die: function()
    {
        me.state.current().restartLevel()
    },
    
    addAttached: function( enemy )
    {
        this.attachedList[ this.attachedList.length ] = enemy;
    },
    
    removeAttached: function( enemyID )
    {
        for ( var i = 0; i < this.attachedList.length; i++ )
        {
            if ( this.attachedList[i].GUID == enemyID )
            {
                this.attachedList.splice( i, 1 );
                return;
            }
        }
    },
    
    shakeOff: function()
    {
        for ( var i = 0; i < this.attachedList.length; i++ )
        {
            this.attachedList[i].decrementAttachCounter( 30 );
        }
    },
    
    hit: function( dmg )
    {
        this.hp -= dmg;
        me.game.HUD.setItemValue( "hp", this.hp );
    },
    
    update: function()
    {      
        if ( me.input.isKeyPressed( "left" ) )
        {
            this.doWalk( true );
            this.curWalkLeft = true;
        }
        else if ( me.input.isKeyPressed( "right" ) )
        {
            this.doWalk( false );
            this.curWalkLeft = false;
        }
        
        if ( me.input.isKeyPressed( "jump" ) )
        {
            this.doJump();
            this.curFlame = new playerParticle( this.pos.x, this.pos.y, "jump", 48, [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ], 4, !this.curWalkLeft, "flame" );
            me.game.add( this.curFlame, 4 );
            me.game.sort();
        }
        
        if ( this.curWalkLeft != this.lastWalkLeft || me.input.isKeyPressed( "jump" ) )
        {
            this.shakeOff();
        }
        this.lastWalkLeft = this.curWalkLeft;
        
        // do damage only once every few frames
        if ( this.hpCounter == 0 )
        {
            this.hit( this.attachedList.length );
            this.hpCounter = this.hpCounterMax;
        }
        else
        {
            this.hpCounter--;
        }
        
        // die if no hp or fall off screen - note may cause issues with long jumps? bit of a hack
        if ( this.hp <= 0 || this.pos.y > me.game.viewport.bottom )
        {
            this.die();
        }
        
        // set animation states
        if ( this.jumping || this.falling )
        {
            this.setCurrentAnimation( "jump" );
        }
        else if ( me.input.isKeyPressed( "left" ) || me.input.isKeyPressed( "right" ) )
        {
            this.setCurrentAnimation( "run" );
        }
        else
        {
            this.setCurrentAnimation( "idle" );
        }
        
        this.updateMovement();
        var res = me.game.collide( this );
        
        // set proper flame/laser positions
        if ( this.curFlame )
        {
            if ( this.curWalkLeft )
            {
                this.curFlame.pos.x = this.pos.x + 96;
            }
            else
            {
                this.curFlame.pos.x = this.pos.x;
            }
            this.curFlame.pos.y = this.pos.y + 32;
        }
        if ( this.curLaser )
        {
        
        }
        
        this.followPos.x = this.pos.x;
        this.followPos.y = this.pos.y + 32;

        // broken method to restrict left cam movement
        /*if ( me.game.viewport.pos.x < this.lastCamX )
        {
            me.game.viewport.move( this.lastCamX, me.game.viewport.pos.y );
        }
        this.lastCamX = me.game.viewport.pos.x;*/
        
        if ( this.vel.x != 0 || this.vel.y != 0 )
        {
            this.parent( this );
            return true;
        }        
        return false;
    }
});

var playerParticle = me.ObjectEntity.extend(
{
    init: function( x, y, sprite, spritewidth, frames, speed, flip, type )
    {
        var settings = new Object();
        settings.image = sprite;
        settings.spritewidth = 48;
        
        this.parent( x, y, settings );
        
        this.animationspeed = speed;
        this.addAnimation( "play", frames );
        this.setCurrentAnimation( "play", function() { me.game.remove( this ) } );
        this.type = type;
        this.flipX( flip );
        
        this.collidable = true;
    },
    
    update: function()
    {
        me.game.collide( this );
        this.parent();
        return true;
    },
    
    onCollision: function()
    {
        //alert( "part coll" );
    }
});
