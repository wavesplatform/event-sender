declare const window, document, console;

class EventSender {
  private static _instance: EventSender;
  private internalQueue: any[][] = []; // push to internal queue when sender is inactive

  /**
	 * EventSender
	 * Singleton.
	 * Most public methods return this, so they're chainable.
   * @constructor
   * @param {boolean} [active] whether a created EventSender is active right away
   */
  constructor(private active: boolean = true) {
    // singleton
    if (EventSender._instance) {
      return EventSender._instance;
    }
    EventSender._instance = this;

    if (active) {
      this._activatePiwik();
    }
  }

  /**
   * Create an inactive EventSender
   * Used to request user's permission before sending any events.
   * @static
   * @return {EventSender}
   */
  public static inactive(): EventSender {
    return new EventSender(false);
  }

  /**
   * Activate event tracking
   * Upon user agreement to send statistics
   * @return {EventSender}
   */
  public activate = (): EventSender => {
    if (this.active) return this;

    this.active = true;
    this._activatePiwik();
    return this;
	};
	
	/**
   * Deactivate event tracking
   * @return {EventSender}
   */
  public deactivate = (): EventSender => {
		this.active = false;
    return this;
  };

	/**
   * Queue custom event
   * @param {string} category e.g 'DEX'
   * @param {string} action e.g 'GetClientClick'
   * @param {string} [label] some additional info
   * @param {string} [value] some numeric value associated with event
   * @return {EventSender}
   */
  public push = (
    category: string,
    action: string,
    label?: string,
    value?: number
  ): EventSender => 
    this._push('_paq', ['trackEvent', category, action, label, value]);

  /**
   * Queue page view
   * Useful for SPA page transitions when no
   * pageView event is tracked by default.
   * @param {string} newUrl ad
   * @param {string} referrer
   * @return {EventSender}
   */
  public pushPageView = (newUrl: string, referrer: string): EventSender =>
    this._pushAll('_paq', [
      ['setReferrerUrl', referrer],
      ['setCustomUrl', newUrl],
      // ['setDocumentTitle', title],
      ['deleteCustomVariables', 'page'],
      ['setGenerationTimeMs', 0],
      ['trackPageView'],
      ['enableLinkTracking'],
    ]);

  private _activatePiwik() {
    // insert code if not already there
    if (document.getElementById('piwik')) return;

		const URL = '//wavesplatform.innocraft.cloud/';
		
		// push internal queue into piwik
		this._pushAll('paq', this.internalQueue);
		this.internalQueue = [];

    this._pushAll('_paq', [
      // ['setDocumentTitle', document.domain + '/' + document.title],
      // ['setCookieDomain', '*.wavesplatform.com'],
      // ['setDomains', ['*.wavesplatform.com']],
      ['trackPageView'],
      ['enableLinkTracking'],
      ['setTrackerUrl', URL + 'piwik.php'],
      ['setSiteId', '3'],
    ]);

    const g = document.createElement('script');
    const s = document.getElementsByTagName('script')[0];

    g.id = 'piwik';
    g.type = 'text/javascript';
    g.async = true;
    g.defer = true;
    g.src = URL + 'piwik.js';
    s.parentNode.insertBefore(g, s);
  }

  private _pushAll(queueName: string, data: any[][]): EventSender {
		if (this.active) {
			window[queueName] = window[queueName] || [];
			data.forEach(obj => window[queueName].push(obj));
		} else {
			this.internalQueue = this.internalQueue.concat(data);
		}
    return this;
  }

  private _push(queueName: string, data: any[]): EventSender {
		if (this.active) {
			window[queueName] = window[queueName] || [];
			window[queueName].push(data);
		} else {
			this.internalQueue.push(data);
		}
    return this;
  }
}

export default EventSender;
