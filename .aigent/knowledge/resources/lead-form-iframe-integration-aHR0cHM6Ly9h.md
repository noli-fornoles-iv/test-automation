# Lead form iframe integration

Tab: Resources
Source: https://app.getguru.com/folders/ca7zqAXi/React-Components?activeCard=6cdd40fa-f217-49d0-a327-09c980335462
Updated: 2026-05-09T10:38:46.310Z

This script is responsible for handling communication between the main webpage and an embedded `iframe` via the `window.postMessage` API. It enables dynamic behavior such as adjusting the iframe's height, triggering data layer events, redirecting the user, and scrolling the iframe into view based on messages received from the iframe.

### 1. Targeting the Iframe

```
const iframe = document.querySelector("iframe[id='australia-fplus-form-iframe']");
```
This line selects the `iframe` element on the page by its `id`. In this case, the expected `id` is `'australia-fplus-form-iframe'`.

### 2. Setting Up the `message` Event Listener

```
window.addEventListener("message", e => {  // ...});
```
This attaches an event listener to the `window` object to listen for incoming `postMessage` events from the iframe. The event object `e` contains data sent from the iframe, which is then conditionally handled inside the listener.

### 3. Dynamic Iframe Height Adjustment

```
if (e.data.frameHeight) {  iframe.style.height = `${e.data.frameHeight}px`;}
```
- **Purpose**: Dynamically adjusts the height of the iframe to match the content inside it.
- **Trigger**: The iframe sends a message with a `frameHeight` value.
- **Effect**: Prevents scrollbars inside the iframe and ensures the embedded content fits seamlessly.

### 4. Sending Events to the Data Layer

```
if (e.data.event) {  
  const dataLayer = window.dataLayer || [];  
  dataLayer.push({    
    event: e.data.event,    
    ...e.data.context.values,  
  });
}
```
- **Purpose**: Pushes events to the `dataLayer` (typically used by Google Tag Manager).
- **Trigger**: The iframe sends a message with an `event` field and optional context data.
- **Effect**: Enables tracking of user interactions occurring inside the iframe (e.g., form submission, error states).

### 6. Scrolling the Iframe into View

```
if (e.data.scrollToCenter) {  
  iframe.scrollIntoView({    
    behavior: "instant",    
    block: "center",    
    inline: "center",  
  });
}
```
- **Purpose**: Automatically scrolls the iframe into the center of the viewport.
- **Trigger**: The iframe sends a message with a `scrollToCenter` flag.
