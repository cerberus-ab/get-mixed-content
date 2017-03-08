# Get mixed content
Simple nodejs script for checking HTTPS page for unsecure HTTP requests which are considered mixed content.

This is not a production-ready code, just my simple script which helped me one day and which also can be a little example of using JavaScript. The script does not render document and does not process inline styles.. so, it should be the next iteration. Also the script does not classify mixed content as passive/display or active content, it is pretty simply. 

### Instruction
Be sure you have nodejs `>=6.0.0`, and then:
```
$ node getmixc.js URL
```
will show you unsecure requests on the HTTPS page by URL.

### Examples
Page with unsecure requests:
```
$ node getmixc.js https://courses.pepperdine.edu/access/content/user/alan.regan/public/Content%20Example%20Unsecured
Mixed content requests on the page (2):
<embed allowfullscreen="true" allowscriptaccess="always" height="315" src="http://www.youtube.com/v/GigYWy2UmOY?hl=en_US&amp;version=3&amp;rel=0" type="application/x-shockwave-flash" width="560">
<script language="JavaScript" src="http://courses.pepperdine.edu/access/content/user/alan.regan/public/countdown.js">
```

Healthy page without unsecure requests:
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
