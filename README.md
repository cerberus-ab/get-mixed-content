# Get mixed content
Simple nodejs script for checking mixed content on https page.

### Instruction
Be sure you have node `>=6.0.0`, and then:
```
$ node getmixc.js URL
```
show you mixed content requests on the https page by URL.

### Examples
Page with unsecure mixed content requests:
```
$ node getmixc.js https://courses.pepperdine.edu/access/content/user/alan.regan/public/Content%20Example%20Unsecured
Mixed content requests on the page (2):
<embed allowfullscreen="true" allowscriptaccess="always" height="315" src="http://www.youtube.com/v/GigYWy2UmOY?hl=en_US&amp;version=3&amp;rel=0" type="application/x-shockwave-flash" width="560">
<script language="JavaScript" src="http://courses.pepperdine.edu/access/content/user/alan.regan/public/countdown.js">
```

Healthy page without unsecure links:
```
$ node getmixc.js https://www.apple.com
The page doesn`t have mixed content requests
```

Page is redirected to another localtion (has returned 3xx status code):
```
$ node getmixc.js https://apple.com
Error: The page is redirected to "https://www.apple.com/"
```

Page has returned another status code:
```
$ node getmixc.js https://www.apple.com/hello
Error: The page has returned 404 status code
```

### Notes
This is not a production ready code, just my simple script which helped me one day and which also can be a little example of using javascript.
