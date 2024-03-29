/* =========================================================
 * composer-custom-views.js v1.1
 * =========================================================
 * Copyright 2013 Wpbakery
 *
 * Visual composer ViewModel objects for shortcodes with custom
 * functionality.
 * ========================================================= */


(function ($) {
    var Shortcodes = vc.shortcodes;
	
	
	 window.VcSectionView = vc.shortcode_view.extend({
        events:{
            'click > .controls .column_delete':'deleteShortcode',
            'click > .controls .column_edit':'editElement',
            'click > .controls .column_clone':'clone',
            'click > .controls .column_move':'moveElement'
        },
        
      sizeRows:function () {
            var max_height = 35;
            $('> .vc_container_for_children', this.$content).each(function () {
                var content_height = $(this).find('> .wpb_element_wrapper > .wpb_section_container').css({minHeight:0}).height();
                if (content_height > max_height) max_height = content_height;
            }).each(function () {
                    $(this).find('> .wpb_element_wrapper > .wpb_section_container').css({minHeight:max_height });
                });
        },
		
       ready:function (e) {
            window.VcSectionView.__super__.ready.call(this, e);
            return this;
        },
        checkIsEmpty:function () {
            window.VcSectionView.__super__.checkIsEmpty.call(this);
        },
		
		changedContent:function (view) {
            this.sizeRows();
        },
		
       moveElement:function (e) {
            e.preventDefault();
        }
    });
	

// Features View	
window.VcFeaturesView = vc.shortcode_view.extend({
	   events:{
			'click > .wpb_add_button':'addButton',
            'click > .controls .column_delete':'deleteShortcode',
            'click > .controls .column_edit':'editElement',
            'click > .controls .column_clone':'clone'
        },
		
        addButton:function (e) {
            e.preventDefault();
            vc.shortcodes.create({shortcode:'vc_feature_box', params:{ icon : 'icon-star' }, parent_id:this.model.id});
            return false;
        },
		
	   setSorting:function () {
            var that = this;
            if (this.$content.find(" > [data-element_type=vc_feature_box] , > [data-element_type=vc_counter]").length > 1) {
			  this.$content.removeClass('wpb-not-sortable').sortable({
                    forcePlaceholderSize:true,
                    placeholder:"element-placeholder",
                   // cursorAt: { left: 10, top : 20 },
                   cursor:"move",
                   items:" > [data-element_type=vc_feature_box]  , > [data-element_type=vc_counter]", //wpb_sortablee
                   tolerance:'pointer',
                    start:function (event, ui) {
                        $('#visual_composer_content').addClass('sorting-started');
                        ui.placeholder.width(ui.item.width());
                    },
                    stop:function (event, ui) {
                        $('#visual_composer_content').removeClass('sorting-started');
                    },
                    update:function () {
                        var $columns = $("> [data-element_type=vc_feature_box] , > [data-element_type=vc_counter]", that.$content);
                        $columns.each(function () {
                            var model = $(this).data('model'),
                                index = $(this).index();
                            model.set('order', index);
                            if ($columns.length - 1 > index) vc.storage.lock();
                            model.save();
                        });
                    },
                    over:function (event, ui) {
                        ui.placeholder.css({maxWidth:ui.placeholder.parent().width()});
                        ui.placeholder.removeClass('hidden-placeholder');
                        // if (ui.item.hasClass('not-column-inherit') && ui.placeholder.parent().hasClass('not-column-inherit')) {
                        //     ui.placeholder.addClass('hidden-placeholder');
                        // }
                    },
                    beforeStop:function (event, ui) {
                        // if (ui.item.hasClass('not-column-inherit') && ui.placeholder.parent().hasClass('not-column-inherit')) {
                        //     return false;
                        // }
                    }
                });
			
			} 
	   },	
		
	 sizeFeatures:function () {
            var max_height = 35;
            $('[data-element_type=vc_feature_box] ,[data-element_type=vc_counter] ', this.$content).each(function () {
                var content_height = $(this).find('> .wpb_element_wrapper').css({minHeight:0}).height();
                if (content_height > max_height) max_height = content_height;
            }).each(function () {
                    $(this).find('> .wpb_element_wrapper').css({minHeight:max_height });
                });
        },	
       ready:function (e) {
            window.VcFeaturesView.__super__.ready.call(this, e);
            return this;
        },
        checkIsEmpty:function () {
            window.VcFeaturesView.__super__.checkIsEmpty.call(this);
			this.setSorting();
        },
		changeShortcodeParams:function (model) {
            var params = model.get('params');
            window.VcFeaturesView.__super__.changeShortcodeParams.call(this, model);
            if (_.isObject(params) ) {
			$('.wpb_custom_content_holder',this.$el).removeClass('columns-' + _.values( this.params.columns.value).join(' columns-')).addClass('columns-' + params.columns); 
			}
        } ,
		changedContent:function (view) {
           this.sizeFeatures();
        },		
    });
	

// Counters  View
window.VcCountersView = VcFeaturesView.extend({
	  addButton:function (e) {
            e.preventDefault();
            vc.shortcodes.create({shortcode:'vc_counter', params:{}, parent_id:this.model.id});
            return false;
        }
    });	

// Window Testimonial View 
window.VcFeatureView = vc.shortcode_view.extend({
	
	deleteShortcode:function (e) {
            if (_.isObject(e)) e.preventDefault();
			if(this.$el.parent().find("> [data-element_type=vc_feature_box] ,  > [data-element_type=vc_counter]").length > 1 ){
            var answer = confirm(window.i18nLocale.press_ok_to_delete_section);
            if (answer === true) this.model.destroy();
			}
			else { alert(window.i18nLocale.one_field_is_required); }
        },
	
 });

	window.VcRowView = vc.shortcode_view.extend({
        change_columns_layout:false,
        events:{
            'click > .controls .column_delete':'deleteShortcode',
            'click > .controls .set_columns':'setColumns',
            'click > .controls .column_add':'addElement',
            'click > .controls .column_edit':'editElement',
            'click > .controls .column_clone':'clone',
            'click > .controls .column_move':'moveElement'
        },
        _convertRowColumns:function (layout) {
            var layout_split = layout.toString().split(/\_/),
                columns = Shortcodes.where({parent_id:this.model.id}),
                new_columns = [],
                new_width = '';
            _.each(layout_split, function (value, i) {
                var column_data = _.map(value.toString().split(''), function (v, i) {
                        return parseInt(v, 10);
                    }),
                    new_column_params, new_column;
                if(column_data.length > 3)
                    new_width = column_data[0] + '' + column_data[1] + '/' + column_data[2] + '' + column_data[3];
                else if(column_data.length > 2)
                    new_width = column_data[0] + '/' + column_data[1] + '' + column_data[2];
                else
                    new_width = column_data[0] + '/' + column_data[1];
                new_column_params = _.extend(!_.isUndefined(columns[i]) ? columns[i].get('params') : {}, {width: new_width}),
                vc.storage.lock();
                new_column = Shortcodes.create({shortcode:(this.model.get('shortcode') === 'vc_row_inner' ? 'vc_column_inner' : 'vc_column'), params:new_column_params, parent_id:this.model.id});
                if (_.isObject(columns[i])) {
                    _.each(Shortcodes.where({parent_id:columns[i].id}), function (shortcode) {
                        vc.storage.lock();
                        shortcode.save({parent_id:new_column.id});
                        vc.storage.lock();
                        shortcode.trigger('change_parent_id');
                    });
                }
                new_columns.push(new_column);

            }, this);
            if (layout_split.length < columns.length) {
                _.each(columns.slice(layout_split.length), function (column) {
                    _.each(Shortcodes.where({parent_id:column.id}), function (shortcode) {
                        vc.storage.lock();
                        shortcode.save({'parent_id':_.last(new_columns).id});
                        vc.storage.lock();
                        shortcode.trigger('change_parent_id');
                    });
                });
            }
            _.each(columns, function (shortcode) {
                vc.storage.lock();
                shortcode.destroy();
            }, this);
            this.model.save();
            // this.sizeRows();
            return false;
        },
        _getCurrentLayoutString: function() {
            var layouts = [];
            $('> .wpb_vc_column, > .wpb_vc_column_inner', this.$content).each(function () {
                var width = $(this).data('width');
                layouts.push(_.isUndefined(width) ? '1/1' : width);
            });
            return layouts.join(' + ');
        },
        setSorting:function () {
            var that = this;
            if (this.$content.find("> [data-element_type=vc_column], > [data-element_type=vc_column_inner]").length > 1) {
                this.$content.removeClass('wpb-not-sortable').sortable({
                    forcePlaceholderSize:true,
                    placeholder:"widgets-placeholder-column",
                    tolerance:"pointer",
                    // cursorAt: { left: 10, top : 20 },
                    cursor:"move",
                    //handle: '.controls',
                    items:"> [data-element_type=vc_column], > [data-element_type=vc_column_inner]", //wpb_sortablee
                    distance:0.5,
                    start:function (event, ui) {
                        $('#visual_composer_content').addClass('sorting-started');
                        ui.placeholder.width(ui.item.width());
                    },
                    stop:function (event, ui) {
                        $('#visual_composer_content').removeClass('sorting-started');
                    },
                    update:function () {
                        var $columns = $("> [data-element_type=vc_column], > [data-element_type=vc_column_inner]", that.$content);
                        $columns.each(function () {
                            var model = $(this).data('model'),
                                index = $(this).index();
                            model.set('order', index);
                            if ($columns.length - 1 > index) vc.storage.lock();
                            model.save();
                        });
                    },
                    over:function (event, ui) {
                        ui.placeholder.css({maxWidth:ui.placeholder.parent().width()});
                        ui.placeholder.removeClass('hidden-placeholder');
                        // if (ui.item.hasClass('not-column-inherit') && ui.placeholder.parent().hasClass('not-column-inherit')) {
                        //     ui.placeholder.addClass('hidden-placeholder');
                        // }
                    },
                    beforeStop:function (event, ui) {
                        // if (ui.item.hasClass('not-column-inherit') && ui.placeholder.parent().hasClass('not-column-inherit')) {
                        //     return false;
                        // }
                    }
                });
            } else {
                if (this.$content.hasClass('ui-sortable')) this.$content.sortable('destroy');
                this.$content.addClass('wpb-not-sortable');
            }
        },
        validateCellsList: function(cells) {
            var return_cells = [],
                split = cells.replace(/\s/g, '').split('+'),
                b;
            var sum = _.reduce(_.map(split, function(c){
                if(c.match(/^[vc\_]{0,1}span\d{1,2}$/)) {
                    var converted_c = vc_convert_column_span_size(c);
                    if(converted_c===false) return 1000;
                    b = converted_c.split(/\//);
                    return_cells.push(b[0] + '' + b[1]);
                    return 12*parseInt(b[0], 10)/parseInt(b[1], 10);
                } else if(c.match(/^[1-9]|1[0-2]\/[1-9]|1[0-2]$/)) {
                    b = c.split(/\//);
                    return_cells.push(b[0] + '' + b[1]);
                    return 12*parseInt(b[0], 10)/parseInt(b[1], 10);
                }
                return 10000;

            }), function(num, memo) {
                memo = memo + num;
                return memo;
            }, 0);
            if(sum!==12) return false;
            return return_cells.join('_');
        },
        setColumns:function (e) {
            if (_.isObject(e)) e.preventDefault();
            var $button = $(e.currentTarget);
            if($button.data('cells')==='custom') {
                var cells = window.prompt(window.i18nLocale.enter_custom_layout, this._getCurrentLayoutString());
                if(_.isString(cells)) {
                    if((cells = this.validateCellsList(cells))!==false) {
                        this.change_columns_layout = true;
                        this._convertRowColumns(cells);
                        this.$el.find('> .controls .vc_active').removeClass('vc_active');
                        $button.addClass('vc_active');
                    } else {
                        window.alert(window.i18nLocale.wrong_cells_layout);
                    }
                }
                return;
            }
            if ($button.is('.vc_active')) return false;

            this.$el.find('> .controls .vc_active').removeClass('vc_active');
            $button.addClass('vc_active');
            this.change_columns_layout = true;
                _.defer(function (view, cells) {
                    view._convertRowColumns(cells);
                }, this, $button.data('cells'));
        },
        sizeRows:function () {
            var max_height = 35;
            $('> .wpb_vc_column, > .wpb_vc_column_inner', this.$content).each(function () {
                var content_height = $(this).find('> .wpb_element_wrapper > .wpb_column_container').css({minHeight:0}).height();
                if (content_height > max_height) max_height = content_height;
            }).each(function () {
                    $(this).find('> .wpb_element_wrapper > .wpb_column_container').css({minHeight:max_height });
                });
        },
        ready:function (e) {
            window.VcRowView.__super__.ready.call(this, e);
            return this;
        },
        checkIsEmpty:function () {
            window.VcRowView.__super__.checkIsEmpty.call(this);
            this.setSorting();
        },
        changedContent:function (view) {
            this.sizeRows();
            if (this.change_columns_layout) return this;
            var column_layout = [];
            $('> .wpb_vc_column, > .wpb_vc_column_inner', this.$content).each(function () {
                var width = $(this).data('width');
                column_layout.push(_.isUndefined(width) ? '11' : width.replace('/', ''));
            });
            this.$el.find('> .controls .vc_active').removeClass('vc_active');
            var $button = this.$el.find('> .controls [data-cells-mask=' + vc_get_column_mask(column_layout.join('_')) + ']');
            if($button.length) {
               $button.addClass('vc_active');
            } else {
                this.$el.find('> .controls [data-cells-mask=custom]').addClass('vc_active');
            }
            this.sizeRows();
        },
        moveElement:function (e) {
            e.preventDefault();
        }
    });

    window.VcColumnView = vc.shortcode_view.extend({
        events:{
            'click > .controls .column_delete':'deleteShortcode',
            'click > .controls .column_add':'addElement',
            'click > .controls .column_edit':'editElement',
            'click > .controls .column_clone':'clone',
            'click > .wpb_element_wrapper > .empty_container':'addToEmpty'
        },
        initialize:function (options) {
            window.VcColumnView.__super__.initialize.call(this, options);
            _.bindAll(this, 'setDropable', 'dropButton');
        },
        ready:function (e) {
            window.VcColumnView.__super__.ready.call(this, e);
            this.setDropable();
            return this;
        },
        render:function () {
            window.VcColumnView.__super__.render.call(this);
            this.$el.attr('data-width', this.model.get('params').width);
            this.setEmpty();
            return this;
        },
        addToEmpty:function (e) {
            e.preventDefault();
            if ($(e.target).hasClass('empty_container')) this.addElement(e);
        },
        setDropable:function () {
            this.$content.droppable({
                greedy:true,
                accept:(this.model.get('shortcode') == 'vc_column_inner' ? '.dropable_el' : ".dropable_el,.dropable_row"),
                hoverClass:"wpb_ui-state-active",
                drop:this.dropButton
            });
            return this;
        },
        dropButton:function (event, ui) {
            if (ui.draggable.is('#wpb-add-new-element')) {
                new vc.element_block_view({model:{position_to_add:'end'}}).show(this);
			}
        },
        setEmpty:function () {
            this.$el.addClass('empty_column');
            this.$content.addClass('empty_container');
        },
        unsetEmpty:function () {
            this.$el.removeClass('empty_column');
            this.$content.removeClass('empty_container');
        },
        checkIsEmpty:function () {
            if (Shortcodes.where({parent_id:this.model.id}).length) {
                this.unsetEmpty();
            } else {
                this.setEmpty();
            }
            if (this.model.get('parent_id')) {
                var row_view = vc.app.views[this.model.get('parent_id')];
                if (row_view.model.get('shortcode').match(/^vc\_row/)) {
                    row_view.sizeRows();
                }
            }
            window.VcColumnView.__super__.checkIsEmpty.call(this);
        },
        /**
         * Create row
         */
        createRow:function () {
            var row = Shortcodes.create({shortcode:'vc_row_inner', parent_id:this.model.id});
            Shortcodes.create({shortcode:'vc_column_inner', params:{width:'1/1'}, parent_id:row.id });
            return row;
        }
  });





	 window.VcSectionContainerView = window.VcColumnView.extend({});
	
	
    window.VcAccordionView = vc.shortcode_view.extend({
        adding_new_tab:false,
        events:{
            'click .add_tab':'addTab',
            'click > .controls .column_delete':'deleteShortcode',
            'click > .controls .column_edit':'editElement',
            'click > .controls .column_clone':'clone'
        },
        render:function () {
            window.VcAccordionView.__super__.render.call(this);
            this.$content.sortable({
                axis:"y",
                handle:"h3",
                stop:function (event, ui) {
                    // IE doesn't register the blur when sorting
                    // so trigger focusout handlers to remove .ui-state-focus
                    ui.item.prev().triggerHandler("focusout");
                    $(this).find('> .wpb_sortable').each(function () {
                        var shortcode = $(this).data('model');
                        shortcode.save({'order':$(this).index()}); // Optimize
                    });
                }
            });
            return this;
        },
        changeShortcodeParams:function (model) {
            window.VcAccordionView.__super__.changeShortcodeParams.call(this, model);
            var collapsible = _.isString(this.model.get('params').collapsible) && this.model.get('params').collapsible === 'yes' ? true : false;
            if (this.$content.hasClass('ui-accordion')) {
                this.$content.accordion("option", "collapsible", collapsible);
            }
        },
        changedContent:function (view) {
            if (this.$content.hasClass('ui-accordion')) this.$content.accordion('destroy');
            var collapsible = _.isString(this.model.get('params').collapsible) && this.model.get('params').collapsible === 'yes' ? true : false;
            this.$content.accordion({
                header:"h3",
                navigation:false,
                autoHeight:true,
                heightStyle: "content",
                collapsible:collapsible,
                active:this.adding_new_tab === false && view.model.get('cloned') !== true ? 0 : view.$el.index()
            });
            this.adding_new_tab = false;
        },
        addTab:function (e) {
            this.adding_new_tab = true;
            e.preventDefault();
            vc.shortcodes.create({shortcode:'vc_accordion_tab', params:{title:window.i18nLocale.section}, parent_id:this.model.id});
        },
        _loadDefaults:function () {
            window.VcAccordionView.__super__._loadDefaults.call(this);
        }
    });

    window.VcAccordionTabView = window.VcColumnView.extend({
        events:{
            'click > [data-element_type] > .controls .column_delete':'deleteShortcode',
            'click > [data-element_type] > .controls .column_add':'addElement',
            'click > [data-element_type] > .controls .column_edit':'editElement',
            'click > [data-element_type] > .controls .column_clone':'clone',
            'click > [data-element_type] > .wpb_element_wrapper > .empty_container':'addToEmpty'
        },
        setContent:function () {
            this.$content = this.$el.find('> [data-element_type] > .wpb_element_wrapper > .vc_container_for_children');
        },
        changeShortcodeParams:function (model) {
            var params = model.get('params');
            window.VcAccordionTabView.__super__.changeShortcodeParams.call(this, model);
            if (_.isObject(params) && _.isString(params.title)) {
                this.$el.find('> h3 .tab-label').text(params.title);
            }
        },
        setEmpty:function () {
            $('> [data-element_type]', this.$el).addClass('empty_column');
            this.$content.addClass('empty_container');
        },
        unsetEmpty:function () {
            $('> [data-element_type]', this.$el).removeClass('empty_column');
            this.$content.removeClass('empty_container');
        }
    });
    window.VcMessageView = vc.shortcode_view.extend({
        changeShortcodeParams:function (model) {
            var params = model.get('params');
            window.VcMessageView.__super__.changeShortcodeParams.call(this, model);
            if (_.isObject(params) && _.isString(params.color)) {
                this.$el.find('> .wpb_element_wrapper').removeClass(_.values(this.params.color.value).join(' ')).addClass(params.color);
            }
        }
    });
   
    window.VcCallToActionView = vc.shortcode_view.extend({
        changeShortcodeParams:function (model) {
            var params = model.get('params');
            window.VcCallToActionView.__super__.changeShortcodeParams.call(this, model);
            if (_.isObject(params) && _.isString(params.position)) {
                this.$el.find('> .wpb_element_wrapper').removeClass(_.values(this.params.position.value).join(' ')).addClass(params.position);
            }
        }
    });

//heading View	
window.VcHeadingView = vc.shortcode_view.extend({
        changeShortcodeParams:function (model) {
            var params = model.get('params');
            window.VcHeadingView.__super__.changeShortcodeParams.call(this, model);
            if (_.isObject(params) && _.isString(params.align)) {
                this.$el.find('> .wpb_element_wrapper').removeClass(_.values(this.params.align.value).join(' ')).addClass(params.align);
            }
        }
    });
	
	
    window.VcToggleView = vc.shortcode_view.extend({
        events:function () {
            return _.extend({'click .toggle_title':'toggle'
            }, window.VcToggleView.__super__.events);
        },
        toggle:function (e) {
            e.preventDefault();
            $(e.currentTarget).toggleClass('toggle_title_active');
            $('.toggle_content', this.$el).toggle();
        },
        changeShortcodeParams:function (model) {
            var params = model.get('params');
            window.VcToggleView.__super__.changeShortcodeParams.call(this, model);
            if (_.isObject(params) && _.isString(params.open) && params.open === 'true') {
                $('.toggle_title', this.$el).addClass('toggle_title_active').next().show();
            }
        }
    });

    window.VcButtonView = vc.shortcode_view.extend({events:function () {
        return _.extend({'click button':'buttonClick'
        }, window.VcToggleView.__super__.events);
    },
        buttonClick:function (e) {
            e.preventDefault();
        },
        changeShortcodeParams:function (model) {
            var params = model.get('params');
            window.VcButtonView.__super__.changeShortcodeParams.call(this, model);
            if (_.isObject(params)) {
                var el_class = 'btn-' + params.style + ' btn-' + params.size;
                this.$el.find('.wpb_element_wrapper').removeClass(el_class);
                this.$el.find('button.title').attr({ "class":"title textfield wpb_button " + el_class });
            }
        }
    });
	
	
   window.VcClientView = vc.shortcode_view.extend(
       {
        changeShortcodeParams:function (model) {
            var params = model.get('params');
            window.VcClientView.__super__.changeShortcodeParams.call(this, model);
            if (_.isObject(params)) {
             if (params.image !== '' && typeof params.image != "undefined") {
				 if( this.$el.find('.wpb_element_title span i').length === 0)
				 {
					 this.$el.find('.wpb_element_title span').append('<i></i>');
				 }
				 if(params.image.match(/^\d+$/)) {
					 var client_icon = this.$el.find('.wpb_element_title span i');
                        $.ajax({
                          type:'POST',
                          url:window.ajaxurl,
                          data:{
                            action:'wpb_single_image_src',
                            content: params.image,
                            size: 'thumbnail'
                          },
                          dataType:'html',
                          context:this
                        }).done(function (url) {
                          client_icon.css('background-image', 'url(' + url + ')');
                          });
                      }
	
			 }
			 else if( this.$el.find('.wpb_element_title span i').length === 0 ){
				 this.$el.find('.wpb_element_title span i').remove();
			 }
            }
        }
    });	
	

		
		
    window.VcTabsView = vc.shortcode_view.extend({
        new_tab_adding:false,
        events:{
            'click .add_tab':'addTab',
            'click > .controls .column_delete':'deleteShortcode',
            'click > .controls .column_edit':'editElement',
            'click > .controls .column_clone':'clone'
        },
        initialize:function (params) {
            window.VcTabsView.__super__.initialize.call(this, params);
            _.bindAll(this, 'stopSorting');
        },
        render:function () {
            window.VcTabsView.__super__.render.call(this);
            this.$tabs = this.$el.find('.wpb_tabs_holder');
            this.createAddTabButton();
            return this;
        },
        ready:function (e) {
            window.VcTabsView.__super__.ready.call(this, e);
        },
        createAddTabButton:function () {
            var new_tab_button_id = (+new Date() + '-' + Math.floor(Math.random() * 11));
            this.$tabs.append('<div id="new-tab-' + new_tab_button_id + '" class="new_element_button"></div>');
            this.$add_button = $('<li class="add_tab_block"><a href="#new-tab-' + new_tab_button_id + '" class="add_tab" title="' + window.i18nLocale.add_tab + '"></a></li>').appendTo(this.$tabs.find(".tabs_controls"));
        },
        addTab:function (e) {
            e.preventDefault();
            this.new_tab_adding = true;
            var tabs_count = this.$tabs.find('[data-element_type=vc_tab],[data-element_type=vc_quote]').length,
                tab_id = (+new Date() + '-' + tabs_count + '-' + Math.floor(Math.random() * 11));
				
                 if(this.model.get('shortcode') === 'vc_quotes_slider') { 
                 	var tab_title = window.i18nLocale.quote;
                 	vc.shortcodes.create({shortcode:'vc_quote', params:{title:tab_title, tab_id:tab_id}, parent_id:this.model.id});
                 }
				 
				 else {
					var tab_title = this.model.get('shortcode') === 'vc_tour' ? window.i18nLocale.slide : window.i18nLocale.tab;
                    vc.shortcodes.create({shortcode:'vc_tab', params:{title:tab_title, tab_id:tab_id}, parent_id:this.model.id});
				 }
            return false;
        },
        stopSorting:function (event, ui) {
            var shortcode;
            this.$tabs.find('ul.tabs_controls li:not(.add_tab_block)').each(function (index) {
                var href = $(this).find('a').attr('href').replace("#", "");
                // $('#' + href).appendTo(this.$tabs);
                shortcode = vc.shortcodes.get($('[id=' + $(this).attr('aria-controls') + ']').data('model-id'));
                vc.storage.lock();
                shortcode.save({'order':$(this).index()}); // Optimize
            });
            shortcode.save();
        },
        changedContent:function (view) {
            var params = view.model.get('params');
            if (!this.$tabs.hasClass('ui-tabs')) {
                this.$tabs.tabs({
                    select:function (event, ui) {
                        if ($(ui.tab).hasClass('add_tab')) {
                            return false;
                        }
                        return true;
                    }
                });
                this.$tabs.find(".ui-tabs-nav").prependTo(this.$tabs);
                this.$tabs.find(".ui-tabs-nav").sortable({
                    axis:(this.$tabs.closest('[data-element_type]').data('element_type') == 'vc_tour' ? 'y' : 'x'),
                    update:this.stopSorting,
                    items:"> li:not(.add_tab_block)"
                });
            }
            if (view.model.get('cloned') === true) {
				
				if(!params.title && this.model.get('shortcode') === 'vc_quotes_slider') params.title = window.i18nLocale.quote;
				
                var cloned_from = view.model.get('cloned_from'),
                    $after_tab = $('[href=#tab-' + cloned_from.params.tab_id + ']', this.$content).parent(),
                    $new_tab = $("<li><a href='#tab-" + params.tab_id + "'>" + params.title + "</a></li>").insertAfter($after_tab);
                this.$tabs.tabs('refresh');
                this.$tabs.tabs("option", 'active', $new_tab.index());
            } else {
				
				if(!params.title && this.model.get('shortcode') === 'vc_quotes_slider') params.title = window.i18nLocale.quote;
        		
                $("<li><a href='#tab-" + params.tab_id + "'>" + params.title + "</a></li>")
                    .insertBefore(this.$add_button);
                this.$tabs.tabs('refresh');
                this.$tabs.tabs("option", "active", this.new_tab_adding ? $('.ui-tabs-nav li', this.$content).length - 2 : 0);

            }
            this.new_tab_adding = false;
        },
        cloneModel:function (model, parent_id, save_order) {
            var shortcodes_to_resort = [],
                new_order = _.isBoolean(save_order) && save_order === true ? model.get('order') : parseFloat(model.get('order')) + vc.clone_index,
                model_clone,
                new_params = _.extend({}, model.get('params'));
				
            if (model.get('shortcode') === 'vc_tab') _.extend(new_params, {tab_id:+new Date() + '-' + this.$tabs.find('[data-element-type=vc_tab]').length + '-' + Math.floor(Math.random() * 11)});
			if (model.get('shortcode') === 'vc_quote') _.extend(new_params, {id:+new Date() + '-' + this.$tabs.find('[data-element-type=vc_quote]').length + '-' + Math.floor(Math.random() * 11)});
            if (model.get('shortcode') === 'vc_history_tab') _.extend(new_params, {id:+new Date() + '-' + this.$tabs.find('[data-element-type=vc_histroy_tab]').length + '-' + Math.floor(Math.random() * 11)});
			
			
			if (model.get('shortcode') === 'vc_quote') { 
	            model_clone = Shortcodes.create({shortcode:model.get('shortcode'), id:vc_guid(), parent_id:parent_id, order:new_order, cloned:(model.get('shortcode') === 'vc_quote' ? false : true), cloned_from:model.toJSON(), params:new_params});
	            _.each(Shortcodes.where({parent_id:model.id}), function (shortcode) {
	                this.cloneModel(shortcode, model_clone.get('id'), true);
	            }, this);
			} else {	
            model_clone = Shortcodes.create({shortcode:model.get('shortcode'), id:vc_guid(), parent_id:parent_id, order:new_order, cloned:(model.get('shortcode') === 'vc_tab' ? false : true), cloned_from:model.toJSON(), params:new_params});
            _.each(Shortcodes.where({parent_id:model.id}), function (shortcode) {
                this.cloneModel(shortcode, model_clone.get('id'), true);
            }, this);
			}
            return model_clone;
        }
    });

    window.VcTabView = window.VcColumnView.extend({
        render:function () {
            var params = this.model.get('params');
            window.VcTabView.__super__.render.call(this);
            this.id = 'tab-' + params.tab_id;
            this.$el.attr('id', this.id);
            return this;
        },
        ready:function (e) {
            window.VcTabView.__super__.ready.call(this, e);
            this.$tabs = this.$el.closest('.wpb_tabs_holder');
            var params = this.model.get('params');
            return this;
        },
        changeShortcodeParams:function (model) {
            var params = model.get('params');
            window.VcAccordionTabView.__super__.changeShortcodeParams.call(this, model);
            if (_.isObject(params) && _.isString(params.title) && _.isString(params.tab_id)) {
                $('.ui-tabs-nav [href=#tab-' + params.tab_id + ']').text(params.title);
            }
        },
        deleteShortcode:function (e) {
            if (_.isObject(e)) e.preventDefault();
            var answer = confirm(window.i18nLocale.press_ok_to_delete_section);
            if (answer !== true) return false;
            this.model.destroy();
            var params = this.model.get('params'),
                current_tab_index = $('[href=#tab-' + params.tab_id + ']', this.$tabs).parent().index();
            $('[href=#tab-' + params.tab_id + ']').parent().remove();
            this.$tabs.tabs('refresh');
            var tab_length = this.$tabs.find('.ui-tabs-nav li:not(.add_tab_block)').length;
            if (current_tab_index < tab_length) {
                this.$tabs.tabs("option", "active", current_tab_index);
            } else if(tab_length>0) {
                this.$tabs.tabs("option", "active", tab_length-1);
            }
        },
        cloneModel:function (model, parent_id, save_order) {
            var shortcodes_to_resort = [],
                new_order = _.isBoolean(save_order) && save_order === true ? model.get('order') : parseFloat(model.get('order')) + vc.clone_index,
                new_params = _.extend({}, model.get('params'));
            if (model.get('shortcode') === 'vc_tab') _.extend(new_params, {tab_id:+new Date() + '-' + this.$tabs.find('[data-element_type=vc_tab]').length + '-' + Math.floor(Math.random() * 11)});
			
			if (model.get('shortcode') === 'vc_quote') _.extend(new_params, {tab_id:+new Date() + '-' + this.$tabs.find('[data-element_type=vc_quote]').length + '-' + Math.floor(Math.random() * 11)});
			
            var model_clone = Shortcodes.create({shortcode:model.get('shortcode'), parent_id:parent_id, order:new_order, cloned:true, cloned_from:model.toJSON(), params:new_params});
            _.each(Shortcodes.where({parent_id:model.id}), function (shortcode) {
                this.cloneModel(shortcode, model_clone.id, true);
            }, this);
            return model_clone;
        }
    });
    /**
     * Old version of tabs for Wordpress 3.5
     * @deprecated
     * @type {*}
     */
    window.VcTabsView35 = vc.shortcode_view.extend({
        new_tab_adding:false,
        events:{
            'click .add_tab':'addTab',
            'click > .controls .column_delete':'deleteShortcode',
            'click > .controls .column_edit':'editElement',
            'click > .controls .column_clone':'clone'
        },
        initialize:function (params) {
            window.VcTabsView.__super__.initialize.call(this, params);
            _.bindAll(this, 'stopSorting');
        },
        render:function () {
            window.VcTabsView.__super__.render.call(this);
            this.$tabs = this.$el.find('.wpb_tabs_holder');
            this.createAddTabButton();
            return this;
        },
        ready:function (e) {
            window.VcTabsView.__super__.ready.call(this, e);
        },
        createAddTabButton:function () {
            var new_tab_button_id = (+new Date() + '-' + Math.floor(Math.random() * 11));
            this.$tabs.append('<div id="new-tab-' + new_tab_button_id + '" class="new_element_button"></div>');
            this.$tabs.find(".tabs_controls").append('<li class="add_tab_block"><a href="#new-tab-' + new_tab_button_id + '" class="add_tab" title="' + window.i18nLocale.add_tab + '"></a></li>');
        },
        addTab:function (e) {
            e.preventDefault();
            this.new_tab_adding = true;
            var tab_title = this.model.get('shortcode') === 'vc_tour' ? window.i18nLocale.slide : window.i18nLocale.tab,
                tabs_count = this.$tabs.tabs("length"),
                tab_id = (+new Date() + '-' + tabs_count + '-' + Math.floor(Math.random() * 11));
            vc.shortcodes.create({shortcode:'vc_tab', params:{title:tab_title, tab_id:tab_id}, parent_id:this.model.id});
            return false;
        },
        stopSorting:function (event, ui) {
            var shortcode;
            this.$tabs.find('ul.tabs_controls li:not(.add_tab_block)').each(function (index) {
                var href = $(this).find('a').attr('href').replace("#", "");
                $('#' + href).appendTo(this.$tabs);
                shortcode = vc.shortcodes.get($('[id=' + $(this).attr('aria-controls') + ']').data('model-id'));
                vc.storage.lock();
                shortcode.save({'order':$(this).index()}); // Optimize
            });
            shortcode.save();
        },
        changedContent:function (view) {
            var params = view.model.get('params');
            if (!this.$tabs.hasClass('ui-tabs')) {
                this.$tabs.tabs({
                    select:function (event, ui) {
                        if ($(ui.tab).hasClass('add_tab')) {
                            return false;
                        }
                        return true;
                    }
                });
                this.$tabs.find(".ui-tabs-nav").prependTo(this.$tabs);
                this.$tabs.find(".ui-tabs-nav").sortable({
                    axis:(this.$tabs.closest('[data-element_type]').data('element_type') == 'vc_tour' ? 'y' : 'x'),
                    stop:this.stopSorting,
                    items:"> li:not(.add_tab_block)"
                });
            }
            if (view.model.get('cloned') === true) {
                var cloned_from = view.model.get('cloned_from');
                var index = $('#tab-' + cloned_from.params.tab_id).index();
                this.$tabs.tabs("add", "#tab-" + params.tab_id, params.title, index - 1);
                this.$tabs.tabs("select", index - 1);
            } else {
                this.$tabs.tabs("add", "#tab-" + params.tab_id, params.title, this.$tabs.tabs("length") - 1);
                this.$tabs.tabs("select", this.new_tab_adding ? (this.$tabs.tabs("length") - 2) : 0);
            }

            this.new_tab_adding = false;
        },
        cloneModel:function (model, parent_id, save_order) {
            var shortcodes_to_resort = [],
                new_order = _.isBoolean(save_order) && save_order === true ? model.get('order') : parseFloat(model.get('order')) + vc.clone_index,
                model_clone,
                new_params = _.extend({}, model.get('params'));
            if (model.get('shortcode') === 'vc_tab') _.extend(new_params, {tab_id:+new Date() + '-' + this.$tabs.tabs('length') + '-' + Math.floor(Math.random() * 11)});
            model_clone = Shortcodes.create({shortcode:model.get('shortcode'), id:vc_guid(), parent_id:parent_id, order:new_order, cloned:(model.get('shortcode') === 'vc_tab' ? false : true), cloned_from:model.toJSON(), params:new_params});
            _.each(Shortcodes.where({parent_id:model.id}), function (shortcode) {
                this.cloneModel(shortcode, model_clone.get('id'), true);
            }, this);
            return model_clone;
        }
    });
    /**
     * Old version of tab for Wordpress 3.5
     * @deprecated
     * @type {*}
     */
    window.VcTabView35 = window.VcColumnView.extend({
        render:function () {
            var params = this.model.get('params');
            window.VcTabView.__super__.render.call(this);
            this.id = 'tab-' + params.tab_id;
            this.$el.attr('id', this.id);
            return this;
        },
        ready:function (e) {
            window.VcTabView.__super__.ready.call(this, e);
            this.$tabs = this.$el.closest('.wpb_tabs_holder');
            var params = this.model.get('params');
            return this;
        },
        changeShortcodeParams:function (model) {
            var params = model.get('params');
            window.VcAccordionTabView.__super__.changeShortcodeParams.call(this, model);
            if (_.isObject(params) && _.isString(params.title) && _.isString(params.tab_id)) {
                $('.ui-tabs-nav [href=#tab-' + params.tab_id + ']').text(params.title);
            }
        },
        deleteShortcode:function (e) {
            if (_.isObject(e)) e.preventDefault();
            var answer = confirm(window.i18nLocale.press_ok_to_delete_section);
            if (answer !== true) return false;
            this.model.destroy();
            var params = this.model.get('params');
            this.$tabs.tabs("remove", $('[href=#tab-' + params.tab_id + ']').parent().index());
        },
        cloneModel:function (model, parent_id, save_order) {
            var shortcodes_to_resort = [],
                new_order = _.isBoolean(save_order) && save_order === true ? model.get('order') : parseFloat(model.get('order')) + vc.clone_index,
                new_params = _.extend({}, model.get('params'));
            if (model.get('shortcode') === 'vc_tab') _.extend(new_params, {tab_id:+new Date() + '-' + this.$tabs.tabs('length') + '-' + Math.floor(Math.random() * 11)});
            var model_clone = Shortcodes.create({shortcode:model.get('shortcode'), parent_id:parent_id, order:new_order, cloned:true, cloned_from:model.toJSON(), params:new_params});
            _.each(Shortcodes.where({parent_id:model.id}), function (shortcode) {
                this.cloneModel(shortcode, model_clone.id, true);
            }, this);
            return model_clone;
        }
    });
    /**
     * Append tab_id tempalate filters
     */

    vc.addTemplateFilter(function (string) {
        var random_id = VCS4() + '-' + VCS4();
        return string.replace(/tab\_id\=\"([^\"]+)\"/g, 'tab_id="$1' + random_id + '"');
    });

})(window.jQuery);