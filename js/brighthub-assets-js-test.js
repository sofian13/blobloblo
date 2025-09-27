jQuery(document).ready(function($) {
    $('.pxl-tabs--layout-3-form .pxl-tabs__input-number-group input[type="radio"]').on('change', function() {
        calculatePrice(this);
        $('.pxl-tabs--layout-3-form .pxl-tabs__input-number-group .pxl-tabs__input-number').removeClass('active');
        $(this).parent().addClass('active');
    });
    $('.pxl-tabs--layout-3-form .pxl-tabs__switch-currency-item input[type="radio"]').on('change', function() {
        calculatePrice(this);
    });
    $('.pxl-tabs--layout-3-form .pxl-tabs__input-number-custom input[type="number"]').on('input', function() {
        calculatePrice(this);
    });

    $('.pxl-tabs--layout-3-form #toggleTab').on('change', function () {
        calculatePrice(this);
    });
    
    function calculatePrice(triggerElement) {
        var $form = $(triggerElement).closest('form');
    
        var price_each_symbol = $form.find('.pxl-tabs__switch-currency-item input[type="radio"]:checked').data('symbol');
        var price_each_plan = $form.find('.pxl-tabs__switch-currency-item input[type="radio"]:checked').data('price-for-plan');
        var price_each_plan_annual = $form.find('.pxl-tabs__switch-currency-item input[type="radio"]:checked').data('price-for-plan-annual');
        var quantity_radio = $form.find('.pxl-tabs__input-number-group input[type="radio"]:checked').val();
        var custom_quantity = $form.find('.pxl-tabs__input-number-custom input[type="number"]').val();

        $('.pxl-tabs--layout-3-form .pxl-tabs__item.active .pxl-pricing__option').each(function () {
            const $option = $(this);
            const st = $option.data('st');
            
            $option.find('.pxl-pricing__option-text').text(st);
        });
    
        var isAnnual = $form.find('#toggleTab').is(':checked');
        var quantity = quantity_radio === 'custom' ? parseInt(custom_quantity) || 1 : parseInt(quantity_radio);
    
        var prices = price_each_plan ? price_each_plan.split(',').map(p => parseFloat(p.trim())) : [];
        var prices_annual = price_each_plan_annual ? price_each_plan_annual.split(',').map(p => parseFloat(p.trim())) : [];
    
        $('.pxl-tabs--layout-3-form .pxl-tabs__item.active .pxl-pricing').each(function(index) {
            var base_price = prices[index] || 0;
            var base_price_annual = prices_annual[index] || 0;
    
            var total_price = base_price * quantity;
            var total_price_annual = base_price_annual * quantity;
    
            var $priceWrapper = $(this).find('.pxl-pricing__price');
            var $priceValue = $priceWrapper.find('[data-price-st][data-price-nd]');
    
            $priceValue
                .attr('data-price-st', total_price)
                .attr('data-price-nd', total_price_annual);
    
            $priceValue.text(isAnnual ? total_price_annual : total_price);
            if(isAnnual) {
                $priceWrapper.find('.pxl-pricing__price-detail')
                    .html(`${price_each_symbol}<span data-price-nd="${total_price}" data-price-st="${total_price_annual}">${isAnnual ? total_price_annual : total_price}</span>`);
                
            } else {
                $priceWrapper.find('.pxl-pricing__price-detail')
                    .html(`${price_each_symbol}<span data-price-st="${total_price}" data-price-nd="${total_price_annual}">${isAnnual ? total_price_annual : total_price}</span>`);
            }
        });
    }
});
