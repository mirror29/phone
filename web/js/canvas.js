
    let eleFile = document.querySelector('#file');
    // 压缩图片需要的一些元素和对象
    let reader = new FileReader(), img = new Image();
    let backgroundImg = new Image()  //背景图
    let c = document.getElementById('myCanvas')
    let context = c.getContext("2d");
    let w ='';
    let h = '';
    let picX = 0;
    let picY = 0;
    // 选择的文件对象
    let file = null;
    let canvas =  document.getElementById('upCanvas'),
        cxt = canvas.getContext('2d');
        canvas.height = '',
        canvas.width = ''
    let enlargePointOrigin = {x:0,y:0};         //图片移动、缩放前的初始参数--（右上角坐标）
    let enlargePoint = {x:0,y:0};               //图片移动 、缩放的实时参数--（右上角坐标）
    let imgPositionOrigin = {x:0, y:0, w:0, h:0};//图片移动、缩放前的初始参数--（左上角坐标+宽高）
    let imgPosition = {x:0, y:0, w:0, h:0};       //图片移动、缩放的实时参数-（左上角坐标+宽高）
    let _downX = 0;
    let _downY = 0;
    let tex_width=0;
 	let tex_height=0;
    let isLoad = 0;//选择的图片是否加载完毕
    let img2 ;     //背景图片对象
    let tl = document.getElementById('tl')
    let br = document.getElementById('br')
    let bl = document.getElementById('bl')
    let tr = document.getElementById('tr')

    $(function(){

        let a=GetRequest();
        let src=a['/fileupload?filename']; 
        modelName = a['modelName']
        modelId = a['id']
        // console.log(modelId)

        // backgroundImg.src = url + '/fileupload?filename=' + src;
        backgroundImg.src = 'img/i6.png';
        
        backgroundImg.onload = function(){        //加载背景图
            // console.log(backgroundImg.height)
            // console.log(backgroundImg.width)

            if(backgroundImg.height>= 1700){
                w = backgroundImg.width * 0.24;
                h = backgroundImg.height * 0.24;
            }else if (backgroundImg.height <= 1500){
                w = backgroundImg.width * 0.28;
                h = backgroundImg.height * 0.28;
            }else if(backgroundImg.height>= 1800){
                w = backgroundImg.width * 0.22;
                h = backgroundImg.height * 0.22;
            }
            else if(backgroundImg.height>= 1900){
                w = backgroundImg.width * 0.2;
                h = backgroundImg.height * 0.2;
            }
            else{
                w = backgroundImg.width * 0.26;
                h = backgroundImg.height * 0.26;
            }
            
            c.height = h;
            c.width = w;
            $('.box').height = h
            $('.box').width = w

            canvas.width = w
            canvas.height = h                       //给画布设置宽高

            clearBg()
            drawBg()
        }
        
        img.setAttribute("crossOrigin",'Anonymous')
        img.onload = function(){

            imgPosition.w = canvas.width;
            imgPosition.h = img.height*canvas.width/img.width ;
            imgPositionOrigin.w = canvas.width;
            imgPositionOrigin.h = img.height*canvas.width/img.width ;
            enlargePoint.x = canvas.width;
            enlargePointOrigin.x = canvas.width;
            console.log(imgPosition.h)   
   
            changeSpan()
            drawBg() 
            
        }

    })

    function changeSpan(){         //控制方框
        $('.box').css("left",'48.2%')

        $('span').css("display",'block')

        if(parseInt(imgPosition.y) < -12){   //左上角
            $(".tl").css("top","-12");
        }else{
            $('.tl').css("top",imgPosition.y)
        }
        if(parseInt(imgPosition.x) < -47){   
            $(".tl").css("left","-47");
        }else{
            $('.tl').css("left",imgPosition.x)
        }

        if(parseInt(imgPosition.y + imgPosition.h) > 480){   //左下角
            $(".bl").css("top","480");
        }else{
            $('.bl').css("top",imgPosition.y + imgPosition.h)
        }
        if(parseInt(imgPosition.x) < -48){   
            $(".bl").css("left","-48");
        }else{
            $('.bl').css("left",imgPosition.x)
        }   

        if(parseInt(imgPosition.y) < -12){   //右上角
            $(".tr").css("top","-12");
        }else{
            $('.tr').css("top",imgPosition.y)
        }
        if(parseInt(imgPosition.x +imgPosition.w) > 251){   
            $(".tr").css("left","251");
        }else{
            $('.tr').css("left",imgPosition.x +imgPosition.w)
        }   

        if(parseInt(imgPosition.y + imgPosition.h) > 480){   //右下角
            $(".br").css("top","480");
        }else{
            $('.br').css("top",imgPosition.y + imgPosition.h)
        }
        if(parseInt(imgPosition.x +imgPosition.w) > 251){   
            $(".br").css("left","251");
        }else{
            $('.br').css("left",imgPosition.x +imgPosition.w)
        }   

    }

    function drawBg(){       
        context.drawImage(backgroundImg, 0,0,w,h);   
        // console.log('绘制成功')
        erase();
        draw();
        // erase()

    }

    function clearBg(){        //清空背景
        context.clearRect(0,0,w,h);
    }

    //将图片载入画布中
    function draw(){
        // console.log(w)
        
        canvas.style.opacity = 0;
        cxt.drawImage(img, 0, 0, img.width, img.height, imgPosition.x, imgPosition.y, imgPosition.w, imgPosition.h);
        let pat = context.createPattern(canvas,"no-repeat");
        context.fillStyle = pat;	
        context.globalCompositeOperation="source-atop";
        context.fillRect(0,0,w,h);	  

    }

    //清空画布
    function erase(){
        cxt.clearRect(0, 0, w, h);
    }

    //获取对象到最屏幕最左边的距离
    function getAbsLeft(obj){
        let l = obj.offsetLeft;
        while(obj.offsetParent!=null){
            obj = obj.offsetParent;
            l += obj.offsetLeft;
        }
        return l;
    }

    //获取对象到最屏幕顶部的距离
    function getAbsTop(obj){
        let t = obj.offsetTop;
        while(obj.offsetParent!=null){
            obj = obj.offsetParent;
            t += obj.offsetTop;
        }
        return t;
    }

    function MoveFun1(){

        canvas.addEventListener("touchstart" ,function(ev){
            if(ev.targetTouches.length == 1 ){//单指 - 移动
                _downX = ev.targetTouches[0].pageX - getAbsLeft(canvas);
                _downY = ev.targetTouches[0].pageY - getAbsTop(canvas);
                // console.log(_downX)

                if((_downX > imgPosition.x) && (_downX < imgPosition.x + imgPosition.w)&& (_downY > imgPosition.y) && (_downY < imgPosition.y + imgPosition.h)){
                    canvas.addEventListener("touchmove", MoveFun2, false);
                }
            }else if(ev.targetTouches.length == 2 ){
                _downX1 = ev.targetTouches[0].pageX - getAbsLeft(canvas);
                _downY1 = ev.targetTouches[0].pageY - getAbsTop(canvas);
                _downX2 = ev.targetTouches[1].pageX - getAbsLeft(canvas);
                _downY2 = ev.targetTouches[1].pageY - getAbsTop(canvas);
                if((_downX1 > imgPosition.x) && (_downX1 < imgPosition.x + imgPosition.w)&& (_downY1 > imgPosition.y) && (_downY1 < imgPosition.y + imgPosition.h) && (_downX2 > imgPosition.x) && (_downX2 < imgPosition.x + imgPosition.w)&& (_downY2 > imgPosition.y) && (_downY2 < imgPosition.y + imgPosition.h)){
                    canvas.addEventListener("touchmove", MoveFun3, false);
                }
            }
            canvas.addEventListener("touchend" ,function(ev){
                imgPositionOrigin.x = imgPosition.x;
                imgPositionOrigin.y = imgPosition.y;
                imgPositionOrigin.w = imgPosition.w;
                imgPositionOrigin.h = imgPosition.h;
                enlargePointOrigin.x = enlargePoint.x;
                enlargePointOrigin.y = enlargePoint.y;
                _downX = 0;
                _downY = 0;
                _downX1 = 0;
                _downY1 = 0;
                _downX2 = 0;
                _downY2 = 0;
                
                canvas.removeEventListener("touchmove", MoveFun2, false);
                canvas.removeEventListener("touchmove", MoveFun3, false);
            });
        });
        
    }

    function MoveFun2(ev){
        // console.log(ev)
        ev.preventDefault();
        ev.stopPropagation();
        let x = ev.targetTouches[0].pageX - getAbsLeft(canvas);
        let y = ev.targetTouches[0].pageY - getAbsTop(canvas);

        imgPosition.x = imgPositionOrigin.x + (x - _downX);
        imgPosition.y = imgPositionOrigin.y + (y - _downY);
    
        enlargePoint.x = enlargePointOrigin.x + (x - _downX);
        enlargePoint.y = enlargePointOrigin.y + (y - _downY);

        drawBg()   
        changeSpan()

        return false
    }

    function MoveFun3(ev){         //缩放
        ev.preventDefault();
        ev.stopPropagation();
        document.removeEventListener("touchmove", MoveFun1, false);
        document.removeEventListener("touchmove", MoveFun2, false);
        let x1 = ev.targetTouches[0].pageX - getAbsLeft(canvas) - imgPosition.x; //触摸点距离图片左边的距离
        let y1 = ev.targetTouches[0].pageY - getAbsTop(canvas) - imgPosition.y; //触摸点距离图片顶部的距离
        let x2 = ev.targetTouches[1].pageX - getAbsLeft(canvas) - imgPosition.x;
        let y2 = ev.targetTouches[1].pageY - getAbsTop(canvas) - imgPosition.y;

        let _n = Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))/Math.sqrt(Math.pow(_downX1-_downX2,2)+Math.pow(_downY1-_downY2,2)); //缩放比例

        let x0 = (ev.targetTouches[0].pageX + ev.targetTouches[1].pageX)/2 - imgPosition.x;
        let y0 = (ev.targetTouches[0].pageY + ev.targetTouches[1].pageY)/2 - imgPosition.y;//中心点-相对图片本身-坐标
        // console.log(y0)

        imgPosition.w = imgPositionOrigin.w*_n;
        imgPosition.h = imgPositionOrigin.h*_n;
        imgPosition.x = (imgPosition.x + enlargePoint.x - imgPosition.w)/2;
        imgPosition.y = (imgPosition.y + enlargePoint.y - imgPosition.h)/2;
        enlargePoint.x = imgPosition.x + imgPosition.w;
        enlargePoint.y = imgPosition.y + imgPosition.h;

        drawBg()
        changeSpan()

        return false
    }

    function changeSize(obj){           //点击红点缩放

        obj.addEventListener('touchstart',function(ev){
            ev.preventDefault();
            ev.stopPropagation();
            var oEv = ev || event;
 
            var oldWidth = imgPosition.w;
            var oldHeight = imgPosition.h;
            var oldX = event.targetTouches[0].pageX;
			var oldY = event.targetTouches[0].pageY;
            var oldLeft = imgPosition.x;
            var oldTop = imgPosition.y;
  
			obj.addEventListener('touchmove',function(ev){
                ev.preventDefault();
                ev.stopPropagation();
                var oEv = ev || event;
 
                if (obj.className == 'tl') {
                    imgPosition.w = oldWidth - (event.targetTouches[0].clientX - oldX) ;
                    imgPosition.h = oldHeight-(event.targetTouches[0].clientY - oldY);
                    imgPosition.x = oldLeft + (event.targetTouches[0].clientX - oldX) ;
                    imgPosition.y = oldTop + (event.targetTouches[0].clientY - oldY) ;
                }
                else if (obj.className == 'bl') {
                    imgPosition.w = oldWidth - (event.targetTouches[0].clientX - oldX);
                    imgPosition.h = oldHeight + (event.targetTouches[0].clientY - oldY);
                    imgPosition.x = oldLeft + (event.targetTouches[0].clientX - oldX);
                    // imgPosition.y = oldTop + (event.targetTouches[0].clientY - oldY);
                    imgPosition.y = oldTop;
                    
                }
                else if (obj.className == 'tr') {
                    imgPosition.w = oldWidth + (event.targetTouches[0].clientX - oldX);
                    imgPosition.h = oldHeight - (event.targetTouches[0].clientY - oldY);
                    // imgPosition.x = oldLeft + (event.targetTouches[0].clientX - oldX);
                    imgPosition.x = oldLeft;
                    imgPosition.y = oldTop + (event.targetTouches[0].clientY - oldY);
                    
                }
                else if (obj.className == 'br') {
                    imgPosition.w = oldWidth + (event.targetTouches[0].clientX - oldX);
                    imgPosition.h = oldHeight + (event.targetTouches[0].clientY - oldY);
                    // imgPosition.x = oldLeft + (event.targetTouches[0].clientX - oldX);
                    imgPosition.x = oldLeft;
                    // imgPosition.y = oldTop + (event.targetTouches[0].clientY - oldY);
                    imgPosition.y = oldTop;
                }

                drawBg()   
                changeSpan()

                return false

			})

            obj.addEventListener('touchend',function(ev){
                // console.log(ev)

                imgPositionOrigin.x = imgPosition.x;
                imgPositionOrigin.y = imgPosition.y;
                imgPositionOrigin.w = imgPosition.w;
                imgPositionOrigin.h = imgPosition.h;

                _downX = 0;
                _downY = 0;
                _downX1 = 0;
                _downY1 = 0;
                _downX2 = 0;
                _downY2 = 0;
                
                canvas.removeEventListener("touchmove", MoveFun2, false);
                canvas.removeEventListener("touchmove", MoveFun3, false);

                return false
    
            })
        })

    }

    // 文件base64化，以便获知图片原始尺寸
    reader.onload = function(e) {
        img.src = e.target.result;

        // imgList.unshift(img);
        let imgSrc = img.src;

        let imgs = ''
        imgs += '<li class="images"><img src="' + imgSrc + '" onclick="changeImg(this)"/></li>'
         // console.log(imgs)    
        $("#foot").find("ul").prepend(imgs);

        // $("#foot").find("ul").width(imgList.length * 118+ 'px')
    };

    eleFile.addEventListener('change', function (event) {

        file = event.target.files[0];
        // 选择的文件是图片
        if (file.type.indexOf("image") == 0) {
            reader.readAsDataURL(file);    
        }

        return file
    });

    $(function(){          //加载后台图片
        $.ajax({
            url:url + "/tuanlist?size=1000",
            type:"post",
            // data:form,
            processData:false,
            contentType:false,
            success:function(data){
                // console.log(data)
                let imgList = data.records

                for (const i in imgList) {
                    $("#foot").find("ul").width(imgList.length * 118+ 'px')

                    if (imgList.hasOwnProperty(i)) {
                        const imgSrc = imgList[i].imagUrl; 
                        let imgs = ''
                        imgs += '<li class="images"><img src="' + url + imgSrc + '" onclick="changeImg(this)"/></li>' 
                        $("#foot").find("ul").append(imgs);
                    }
                }
                window.imgList = imgList
            }
            
         }); 
    })

    function changeImg(e){
        img.src = e.src;  
    }

    function showModal(){              //显示模态框
        let modal  = document.getElementById('mymodal');
        modal.style.display = 'block';

        let image = new Image();
        let upImg = new Image();
        image.src = canvas.toDataURL("image/png");
        image.setAttribute("crossOrigin",'Anonymous');
        canvas.height = h/0.26;
        canvas.width = w/0.26;
        cxt.drawImage(img, 0, 0, img.width, img.height, imgPosition.x/0.26, imgPosition.y/0.26, imgPosition.w/0.26, imgPosition.h/0.26);
        upImg.src = canvas.toDataURL("image/jpeg");
        upImg.setAttribute("crossOrigin",'Anonymous');
        
        // console.log(upImg.src)

        let form=new FormData();
        form.append("orderPic",upImg.src);
        form.enctype="multipart/form-data"
        form.append("modelName",modelName);
        form.append("modelId",modelId);

        $.ajax({    //保存订单
            url: url + "/saveOrder",
            type:"post",
            data:form,
            processData:false,
            contentType:false,
            success:function(data){
                console.log(data)
                $('#text').html(data)
            } 
         }); 

        $('.tl').css("display",'none')
        $('.bl').css("display",'none')
        $('.tr').css("display",'none')
        $('.br').css("display",'none')

    }

    function hideModal(){         //隐藏模态框
        let modal  = document.getElementById('mymodal')

        modal.style.display = 'none';

        canvas.height = h;
        canvas.width = w;
        cxt.drawImage(img, 0, 0, img.width, img.height, imgPosition.x, imgPosition.y, imgPosition.w, imgPosition.h);

        $('#text').html('')

        changeSpan()
    }

    function copy(){              //复制文字
        var text = document.getElementById("text").innerText;
        var input = document.getElementById("input");
        input.value = text; // 修改文本框的内容
        input.select(); // 选中文本
        document.execCommand("copy"); // 执行浏览器复制命令
        alert("复制成功");
    }

    function GetRequest() {        //接受参数
        let url = location.search; //获取url中"?"符后的字串
        let theRequest = new Object();
        let head = new Object();
        if (url.indexOf("?") != -1) {
            let str = url.substr(1);
            strs = str.split("&");
            for (let i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
            }
        }
        console.log(theRequest)
        return theRequest;
    }
		 

        