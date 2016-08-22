class BsSlideOutTipDirective {
    constructor() {
        Object.assign(this, {
            restrict: 'C',
            scope: {
                'iconClass': '@iconClass',
                'tip': '@tip'
            },
            template: `
                <i class="{{ iconClass }} tip-icon"></i>
                <span class="tip-text-wrap">
                     <i class="tip-text">{{ tip }}</>
                </span>`,

            link (scope, elem, attrs, ctrl) {
                var icon = angular.element(elem[0].querySelector('.tip-icon'));
                var text = angular.element(elem[0].querySelector('.tip-text'));

                function show() {
                    text.addClass('show');
                }

                function hide() {
                    text.removeClass('show');
                }

                icon.on('mouseover', show);
                icon.on('mouseenter', show);
                icon.on('mouseleave', hide);
            }
        });
    }

    static create() {
        return new BsSlideOutTipDirective();
    }
}

export default BsSlideOutTipDirective.create;