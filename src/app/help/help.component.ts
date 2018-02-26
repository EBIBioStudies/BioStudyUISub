import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'help-page',
    templateUrl: './help.component.html',
    styleUrls: ['/help.component.css']
})

/**
 * Makes in-page navigation possible. Angular's routing tends to take over even if the target
 * is just a fragment.
 */
export class HelpComponent {
    jumpTo(event): void {

        //Cancels any routing
        event.preventDefault();

        //Scrolls down to the relevant section taking into account sticky header's height.
        try {
            const sectionEl = document.querySelector(event.target.getAttribute('href'));
            window.scrollBy(0, sectionEl.getBoundingClientRect().top - 100);

        } catch (exception) {
            console.error('Target unknown');
        }
    }
}