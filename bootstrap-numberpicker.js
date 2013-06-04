(function(){
	var NumberPicker = function(element,options){
	
		this.options =  options;
		this.$element = $(element);
		this.min= options.min||0;
		this.max= options.max||59;
		this.numberIncrease= options.numberIncrease||1;
		this.maxCloumn= options.maxCloumn||1;
		this.init();
	};
	NumberPicker.prototype={
		constructor: NumberPicker,
		init:function(){
			this.$element.wrap("<span class='input-append'>")
			this.$element.on('mousewheel',$.proxy(function(e,d){
				e.preventDefault();
				var val =this.$element.val() || 0
				val =parseInt(val,10);
				if(d>0  && val>this.min ){
					val = val-1
				}else if(d<0 && val<this.max){
					val = val+1
				}
				this.setValue(val);
				
			},this));
			
			this.$widget = $(this.template());
			this.$addon = $('<span class="add-on"><i class="icon-chevron-down"></i></span>');
			this.$addon.on('click',$.proxy(this.iconClick, this));
			this.$element.after(this.$widget);
			this.$element.after(this.$addon);
			this.$widget.find('td').on('click',$.proxy(this.numberSelect, this));
			this.$widget.css({
				'width':70*this.maxCloumn
				,
				'min-width':24*this.maxCloumn
				})
			this.$widget.on('mousewheel',function(e){
				e.preventDefault();
			});
			this.$widget.show();
			this.$widget.jScrollPane();
			this.$widget.hide();
			
		},
		_show:function(){
		
			 var pos = $.extend({}, this.$element.offset(), {
                height: this.$element[0].offsetHeight
            });
			this.$widget.css({
                     top: pos.top + pos.height
                    , left: pos.left
            });
           $icon = this.$addon.find('i');
            $icon.removeClass('icon-chevron-down');
			$icon.addClass('icon-remove');
            this.$widget.show();
		},
		_hide:function(){
			$icon = this.$addon.find('i');
			$icon.removeClass('icon-remove');
			$icon.addClass('icon-chevron-down');
			this.$widget.hide();
		},
		iconClick:function(){
			var $icon = this.$addon.find('i');
			if($icon.hasClass('icon-chevron-down')){
				this._show();
			}else{
				this._hide();
			}
		},
		update:function(){
			var val = parseInt(this.$element.val());
			var $jsp = this.$widget.data('jsp');
			var toY = ((val/this.numberIncrease)/this.maxCloumn)*26
			$jsp.scrollTo(0, toY);
			this.$element.trigger('changeNumber');
			$td = this.$widget.find('td');
			
			$td.each(function(i,e){
				$e = $(e)
				if($e .text()==val){
					$td.removeClass('selected');
					return $e.addClass('selected');
				}
			})
		},
		setValue:function(val){
			val = parseInt(val,10);
			if(val>this.max){
				val = this.max;
			}
			if(val<this.min){
				val = this.min;
			}
			if(val<10){
				val="0"+val;
			}
			this.$element.val(val);
			this.update();
		},
		numberSelect:function(e){
			e.preventDefault();
			this.setValue($(e.target).text());
			this._hide();
		},
		template:function(){
			var numberPicker = new Array();
			numberPicker.push("<div class='dropdown-menu'id='numberPicker' style='position:absolute'><table class='table-condensed' style='width:100%;text-align:center'>");
			
			for(var i = this.min,j=1;i<=this.max;i=i+this.numberIncrease){
				if(i===this.min || (i>this.maxCloumn && j%this.maxCloumn===1)){
					numberPicker.push('<tr>')
				}
				var number = i;
				if(i<10){
					number = "0"+i;
				}
				numberPicker.push('<td>'+number+'</td>');
				if((j % this.maxCloumn) ===0 || (i===this.max) ){
					numberPicker.push('</tr>')
				}
				j++;
			} 
			numberPicker.push('</table></div>');
			return numberPicker.join('');
			
		}
		
		
	};
	
	$.fn.numberPicker=function(option){
		var args = Array.apply(null, arguments);
		args.shift();
		return this.each(function () {
			var $this = $(this),
				data = $this.data('numberPicker'),
				options = typeof option == 'object' && option;
			if(!data){
				$this.data('numberPicker',(data = new NumberPicker(this, $.extend({}, $.fn.numberPicker.defaults,options))));
			}
			if (typeof option == 'string') data[option].apply(data, args);
		})
	};
	
	$.fn.numberPicker.defaults={
		min:0,
		max:59,
		numberIncrease:1,
		maxCloumn:1
	};
})(this)
