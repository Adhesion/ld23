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
        
        this.updateColRect( 24, 96, -1 );
        
        this.lastWalkLeft = false;
        this.curWalkLeft = false;
        
        this.attachedList = new Array();
        
        this.collidable = true;
        
        this.hp = 100;
        
        me.game.viewport.follow( this.pos, me.game.viewport.AXIS.BOTH );
        
        me.input.bindKey( me.input.KEY.LEFT, "left" );
        me.input.bindKey( me.input.KEY.RIGHT, "right" );
        me.input.bindKey( me.input.KEY.X, "jump", true );
        me.input.bindKey( me.input.KEY.C, "shoot" );
        
        me.game.player = this;
    },
    
    die: function()
    {
        alert( "dead" );
    },
    
    addAttached: function( enemy )
    {
        this.attachedList[ this.attachedList.length ] = enemy;
    },
    
    shakeOff: function()
    {
        for ( enemy in this.attachedList )
        {
            enemy.attachedCounter--;
        }
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
        }
        
        if ( this.curWalkLeft != this.lastWalkLeft || me.input.isKeyPressed( "jump" ) )
        {
            //alert( "flip" );
            this.shakeOff();
        }
        this.lastWalkLeft = this.curWalkLeft;
        
        this.updateMovement();
        var res = me.game.collide( this );
        
        if ( this.vel.x != 0 || this.vel.y != 0 )
        {
            this.parent( this );
            return true;
        }        
        return false;
    }
});
