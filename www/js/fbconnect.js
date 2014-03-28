(function(FBConnect){
    /*
Copyright (c) 2011, Daniel Guerrero
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL DANIEL GUERRERO BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Uses the new array typed in javascript to binary base64 encode/decode
 * at the moment just decodes a binary base64 encoded
 * into either an ArrayBuffer (decodeArrayBuffer)
 * or into an Uint8Array (decode)
 * 
 * References:
 * https://developer.mozilla.org/en/JavaScript_typed_arrays/ArrayBuffer
 * https://developer.mozilla.org/en/JavaScript_typed_arrays/Uint8Array
 */

window.Base64Binary = {
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    
    /* will return a  Uint8Array type */
    decodeArrayBuffer: function(input) {
        var bytes = (input.length/4) * 3;
        var ab = new ArrayBuffer(bytes);
        this.decode(input, ab);
        
        return ab;
    },
    
    decode: function(input, arrayBuffer) {
        //get last chars to see if are valid
        var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));      
        var lkey2 = this._keyStr.indexOf(input.charAt(input.length-2));      
    
        var bytes = (input.length/4) * 3;
        if (lkey1 == 64) bytes--; //padding chars, so skip
        if (lkey2 == 64) bytes--; //padding chars, so skip
        
        var uarray;
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        var j = 0;
        
        if (arrayBuffer)
            uarray = new Uint8Array(arrayBuffer);
        else
            uarray = new Uint8Array(bytes);
        
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        
        for (i=0; i<bytes; i+=3) {  
            //get the 3 octects in 4 ascii chars
            enc1 = this._keyStr.indexOf(input.charAt(j++));
            enc2 = this._keyStr.indexOf(input.charAt(j++));
            enc3 = this._keyStr.indexOf(input.charAt(j++));
            enc4 = this._keyStr.indexOf(input.charAt(j++));
    
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
    
            uarray[i] = chr1;           
            if (enc3 != 64) uarray[i+1] = chr2;
            if (enc4 != 64) uarray[i+2] = chr3;
        }
    
        return uarray;  
    }
}


    // var BKGM = BKGM||{}; 
    
    if ( XMLHttpRequest.prototype.sendAsBinary === undefined ) {
        XMLHttpRequest.prototype.sendAsBinary = function(string) {
            var bytes = Array.prototype.map.call(string, function(c) {
                return c.charCodeAt(0) & 0xff;
            });
            this.send(new Uint8Array(bytes).buffer);
        };
    }
    function PostImageToFacebook(authToken, filename, mimeType, imageData, obj)
    {
        if (imageData != null)
        {
            //Prompt the user to enter a message
            //If the user clicks on OK button the window method prompt() will return entered value from the text box. 
            //If the user clicks on the Cancel button the window method prompt() returns null.
            var message = prompt('Facebook', 'Enter a message');

            if (message != null)
            {
                var ajax = {
                    success: obj.success ? obj.success : null,
                    error: obj.error ? obj.error : null,
                    complete: obj.complete ? obj.complete : null
                }
                // this is the mult
                // let's encode ouripart/form-data boundary we'll use
                var boundary = '----ThisIsTheBoundary1234567890';
                var formData = '--' + boundary + '\r\n'
                formData += 'Content-Disposition: form-data; name="source"; filename="' + filename + '"\r\n';
                formData += 'Content-Type: ' + mimeType + '\r\n\r\n';
                for (var i = 0; i < imageData.length; ++i)
                {
                    formData += String.fromCharCode(imageData[ i ] & 0xff);
                }
                formData += '\r\n';
                formData += '--' + boundary + '\r\n';
                formData += 'Content-Disposition: form-data; name="message"\r\n\r\n';
                formData += message + '\r\n'
                formData += '--' + boundary + '--\r\n';

                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://graph.facebook.com/me/photos?access_token=' + authToken, true);
                xhr.onreadystatechange = function(ev){
                    if (xhr.status==200) {
                        if(ajax.success) ajax.success(xhr.responseText);
                        if (xhr.readyState==4)
                            if (ajax.complete) ajax.complete(xhr.responseText)            
                    } else {
                        if (ajax.error) ajax.error(xhr.responseText);
                    }            
                };
                xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
                xhr.sendAsBinary(formData);
            }
        }
    };
    function toBKGMScore(fbResponse, requestScoreParams) {
        var result = new BKGM.Score(fbResponse.user.id, fbResponse.score, fbResponse.user.name);
        if (requestScoreParams) {
            result.leaderboardID = requestScoreParams.leaderboardID;
        }
        result.imageURL = 'https://graph.facebook.com/' + fbResponse.user.id + '/picture';
        return result;
    };
    BKGM.FBConnect = function(){        
        // return this;
    }
    BKGM.FBConnect.prototype= {
        init:function(obj,callback){
            var self=this;
            var app_id="296632137153437";
            if (obj){
                app_id=obj.appId;
            }
            try {
                this._isCordova ? FB.init({ appId: app_id, nativeInterface: CDV.FB, useCachedDialogs: false }) : FB.init({ appId: app_id,status: true,xfbml: true,cookie: true,frictionlessRequests: true,oauth: true});
                
            } catch (e) {
                alert(e);
            }
            // FB.Event.subscribe('auth.statusChange', self.handleStatusChange);
        },
        handleStatusChange:function(session) {
            if (session.authResponse) {
                 var str="";
                    for (var x in session.authResponse){
                        str+=x;
                    }
                    alert(str);
            }
        },
        logout:function(callback) {
            var self=this;
            FB.logout(function(response) {
                if(callback) callback(response);
            });
        },            
        login:function(callback) {
            var self=this;
            FB.Event.subscribe('auth.authResponseChange', function(res) {
                if (res.status === 'connected') {
                    if(callback) callback(res);
                } else {
                FB.login(
                    function(response) {
                        if (response.session) {
                            if(callback) callback(response);
                        } else {
                            if(callback) callback(response);
                        }
                    },
                    { scope: "publish_actions" }
                );
                }
              });
            
            
        },
        getLoginStatus: function(callback) {
            var self=this;
            FB.getLoginStatus(function(response) {
                              if (response.status == 'connected') {
                                self.isLogin=true;
                                if (response.authResponse && callback) 
                                    callback(response.authResponse);
                              } else {
                                self.isLogin=false;
                                if (callback) callback(false);
                              }
                              });
            return this;
        },
        getAuthResponse: function(callback1){
            var self=this;
            FB.getLoginStatus(function(response) {
                  if (response.status == 'connected') {
                    if (response.authResponse && callback1) 
                        {
                            callback1(response.authResponse.accessToken,response.authResponse.userId);
                        }
                  } else {
                    self.login(function(response){
                        if(response && response.authResponse) {authResponse=response.authResponse; if (callback1) callback1(authResponse.accessToken,authResponse.userId);}
                    })
                  }
                  });
        },
        postCanvas:function(message, callback) {
            this.getAuthResponse(function(access_token,uid){
                // var uid = authResponse.userID;
                // var access_token = authResponse.accessToken;
                var canvas = document.getElementById("game");
                var imageData = canvas.toDataURL("image/png");
                var mess =message || "http://fb.com/BKGameMaker.com";
                var encodedPng = imageData.substring(imageData.indexOf(',')+1,imageData.length);
                var decodedPng = Base64Binary.decode(encodedPng);
                PostImageToFacebook(access_token, "filename.png", 'image/png', decodedPng);
              
            });

            

        },
        submitScore:function(score,params,callback){
            this.requestScore(params,function(currentScore, error) {
                if (error) {                    
                    if (callback)
                        callback(error);
                   return;
                }
                var topScore = currentScore ? currentScore.score : 0;
                if (score <= topScore) {
                    //don't submit the new score because a better score is already submitted
                    if (callback)
                        callback(null);
                    return;
                }
                var apiCall = "/" + ((params && params.userID) ? params.userID : "me") + "/scores";
                FB.api(apiCall, 'POST', {score:score}, function (response) {
                     if (callback)
                        callback(response.error);
                });
            })
            
        },
        getScore: function(params,callback) {
            var apiCall = ((params && params.userID) ? params.userID : "me") + "/scores";
            FB.api(apiCall, function(response) {
                if (response.error) {
                    callback(null, response.error);
                    return new BKGM.Score("me",0);
                }
                else if (response.data && response.data.length > 0) {
                    var toBKGMScore = fromFBScoreToCocoonScore(response.data[0]);
                    callback(toBKGMScore,null);
                    return toBKGMScore;
                }
                else {
                    //No score has been submitted yet for the user
                    callback(null,null);
                    return new BKGM.Score("me",0);
                }

            });
        },
    };
   
})();