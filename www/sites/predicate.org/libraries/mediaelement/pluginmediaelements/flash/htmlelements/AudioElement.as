﻿
package htmlelements 
{
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.events.TimerEvent;
	import flash.media.ID3Info;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.media.SoundLoaderContext;
	import flash.media.SoundTransform;
	import flash.net.URLRequest;
	import flash.utils.Timer;


	
	/**
	* ...
	* @author DefaultUser (Tools -> Custom Arguments...)
	*/
	public class AudioElement implements IMediaElement
	{		
		
		private var _sound:Sound;
		private var _soundTransform:SoundTransform;
		private var _soundChannel:SoundChannel;
		private var _soundLoaderContext:SoundLoaderContext;								
				
		private var _volume:Number = 1;				
		private var _preMuteVolume:Number = 0;				
		private var _isMuted:Boolean = false;
		private var _isPaused:Boolean = false;
		private var _isEnded:Boolean = false;		
		private var _isLoaded:Boolean = false;		
		private var _currentTime:Number = 0;
		private var _duration:Number = 0;
		private var _bytesLoaded:Number = 0;
		private var _bytesTotal:Number = 0;				
		private var _bufferedTime:Number = 0;						
		
		private var _currentUrl:String = "";
		private var _autoplay:Boolean = true;
		
		private var _element:FlashMediaElement;
		private var _timer:Timer;
		
		public function AudioElement(element:FlashMediaElement, autoplay:Boolean) 
		{
			_element = element;
			_autoplay = autoplay;
			
			_timer = new Timer(200);
			_timer.addEventListener(TimerEvent.TIMER, timerEventHandler);
			
			_soundTransform = new SoundTransform();
			_soundLoaderContext = new SoundLoaderContext();
		}
		
		// events
		function progressHandler(e:ProgressEvent):void {
			
			_bytesLoaded = e.bytesLoaded;
			_bytesTotal = e.bytesTotal;
			
			sendEvent(HtmlMediaEvent.PROGRESS);
		}
		
		function id3Handler(e:Event):void {
			try {
				var id3:ID3Info = _sound.id3;
				var obj = {
					type:'id3',
					album:id3.album,
					artist:id3.artist,
					comment:id3.comment,
					genre:id3.genre,
					songName:id3.songName,
					track:id3.track,
					year:id3.year
				}
				//_playerCore.sendEvent(PlayerEvent.META,obj);
			} catch (err:Error) {}			
		}
		
		function timerEventHandler(e:TimerEvent) {
			_currentTime = _soundChannel.position/1000;			
			
			// calculate duration
			var duration = Math.round(_sound.length * _sound.bytesTotal/_sound.bytesLoaded/100) / 10;
			
			// check to see if the estimated duration changed
			if (_duration != duration && !isNaN(duration)) {
				
				_duration = duration;
				sendEvent(HtmlMediaEvent.LOADEDMETADATA);
			}
			
			// send timeupdate
			sendEvent(HtmlMediaEvent.TIMEUPDATE);
			
			// sometimes the ended even doesn't fire, here's a fake one
			if (_currentTime >= _duration-0.2) {
				handleEnded();
			}
		}
		
		function soundCompleteHandler(e:Event) {
			handleEnded();
		}
		
		function handleEnded():void {
			_timer.stop();
			_currentTime = 0;
			_isEnded = true;
		
			sendEvent(HtmlMediaEvent.ENDED);
		}
		
		//events
		

		// METHODS
		public function setSrc(url:String):void {
			_currentUrl = url;
			_isLoaded = false;
		}		

		
		public function load():void {
			
			if (_currentUrl == "")
				return;
			
			_sound = new Sound();
			//sound.addEventListener(IOErrorEvent.IO_ERROR,errorHandler);
			_sound.addEventListener(ProgressEvent.PROGRESS,progressHandler);
			_sound.addEventListener(Event.ID3,id3Handler);						
			_sound.load(new URLRequest(_currentUrl));
			_currentTime = 0;
						
			//sendEvent(HtmlMediaEvent.LOADING);	
			
			_isLoaded = true;	
			
			if (_playAfterLoading) {
				_playAfterLoading = false;
				play();
			}
		}
		
		private var _playAfterLoading:Boolean= false;
		
		public function play():void {		
			
			if (!_isLoaded) {
				_playAfterLoading = true;
				load();
				return;
			}
			
			_timer.stop();
			
			_soundChannel = _sound.play(_currentTime, 0, _soundTransform);
			_soundChannel.removeEventListener(Event.SOUND_COMPLETE, soundCompleteHandler);
			_soundChannel.addEventListener(Event.SOUND_COMPLETE, soundCompleteHandler);	
			
			_timer.start();
			
			_isPaused = false;			
			sendEvent(HtmlMediaEvent.PLAYING);
		}		
		
		public function pause():void {
			
			_timer.stop();
			_currentTime = _soundChannel.position;
			_soundChannel.stop();
			
			_isPaused = true;
			sendEvent(HtmlMediaEvent.PAUSED);
		}		
		
		public function setCurrentTime(pos:Number):void {
			_timer.stop();
			_currentTime = pos;
			_soundChannel.stop();
			_sound.length
			_soundChannel = _sound.play(_currentTime * 1000, 0, _soundTransform);
			
			sendEvent(HtmlMediaEvent.SEEKED);
			_timer.start();
			
			//play();			
		}
		
		public function stop():void {
			_timer.stop();
			_soundChannel.stop();
		}
		
		public function setVolume(volume:Number):void {
			_soundTransform.volume = volume;
			_soundChannel.soundTransform = _soundTransform;
			
			_volume = volume;
			
			sendEvent(HtmlMediaEvent.VOLUMECHANGE);
		}		
		

		public function setMuted(muted:Boolean):void {
			
			// ignore if already set
			if ( (muted && _isMuted) || (!muted && !_isMuted))
				return;
			
			if (muted) {
				_preMuteVolume = _soundTransform.volume;
				setVolume(0);
			} else {
				setVolume(_preMuteVolume);				
			}
			
			_isMuted = muted;
		}
		
		public function unload():void {
			_sound = null;
			_isLoaded = false;
		}
		
		private function sendEvent(eventName:String) {
			
			// build JSON
			var values:String = "{duration:" + _duration + 
							",currentTime:" + _currentTime + 
							",muted:" + _isMuted + 
							",paused:" + _isPaused + 
							",ended:" + _isEnded + 	
							",volume:" + _volume +
							",bytesTotal:" + _bytesTotal +							
							",bufferedBytes:" + _bytesLoaded +
							",bufferedTime:" + _bufferedTime +					
							"}";
			
			_element.sendEvent(eventName, values);			
		}			
		
	}
	
}