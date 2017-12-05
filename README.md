## Event Sender

An interface for sending analytics events from Waves JS applications.

---

Usage:

```javascript
import EventSender from '@waves/event-sender';

// EventSender is a singleton, so any new attemps at instantiation
// will return a reference to a previously created instance
const sender = new EventSender();

// E.g.
const sender2 = new EventSender();
sender === sender2 // true


// Static method .inactive() returns an instance of EventSender that queues events,
// but does not send them until .activate() method is called
const sender = EventSender.inactive();

// (!) If an EventSender instance has been activated before, this will
// return a reference to it, so it WILL be active.



/** Queue custom event */
sender.push('Product', 'GetClientClick', 'my_custom_label', 2.0);

/**
 * Queue page view
 * Useful for SPA page transitions when no
 * pageView event is tracked by default.
 */
sender.pushPageView(window.location.href, document.referrer);


// Enables sending events, including those queued before.
sender.activate();


// EventSender methods are chainable:
sender
  .activate()
  .push('Product', 'GetClientClick', 'my_custom_label', 2.0)
  .pushPageView(window.location.href, document.referrer)
  .push('Home', 'Subscribe');
```
