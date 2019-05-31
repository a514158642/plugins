/**
 * upLoadImg (http://blog.csdn.net/u598975767/article/details/75500890)
 * 基于jquery+html5 上传及压缩图片
 * @version     v0.1
 * @author      benboerba
 */
;(function($){
	var imgFiles=function(el,opt){
		this.element=el;
		this.file=el[0].files[0];
		this.url="";
		this.default={
			"showImage":"",//需要展示的img标签Id
			"width":375,//目标图片宽度，为保证图片不失真或变形，高度会等比例变化
			"quality":0.8,//图片质量，取值0-1之间
			"callBack":function(){}
		};
		this.options=$.extend({},this.default,opt);
	};
	/**
	 * 压缩图片  创建一个image对象，给canvas绘制使用
	 * @params image:图片对象
	 * @return 返回一个上送给后台的图片流 
	 */
	imgFiles.prototype.compress=function(image){
		var cvs = document.createElement('canvas');
	    //根据设备宽度高,设定缩放后的宽度，计算出缩放比例，建议以宽度为准
	    var scale = this.options.width / image.width;
	    //只压缩，不扩大
	    if(this.options.width>image.width){
	    	scale=1;
	    }
	    //计算等比缩小后图片宽高   
	    cvs.width = image.width*scale;    
	    cvs.height = image.height*scale;     
	    var ctx = cvs.getContext('2d');    
	    ctx.drawImage(image, 0, 0, cvs.width, cvs.height); 
	    var newImageData = cvs.toDataURL(this.file.type,this.options.quality); 
	    var sendData = newImageData.replace("data:"+this.file.type+";base64,",'');  
	    return sendData;
	};
	/**
	 * 上传图片
	 */
	imgFiles.prototype.getImages=function(){
		var $that=this;
		var files = $that.file;
	    //检验是否为图像文件  
	    if(!/image\/\w+/.test(files.type)){ 
	        alert("请选择图片");
	        $that.element.val("");
	        return false;  
	    }  
	    var reader = new FileReader();  
	    //将文件以Data URL形式读入页面  
	    reader.readAsDataURL(files);  
	    reader.onload=function(e){  
	        var result = this.result;
	        if($("#"+$that.options.showImage)){
	        	$("#"+$that.options.showImage).attr({"src": result});
	        }
	        var image = new Image();  
	        image.src = result; 
	        image.onload = function(){
	            $.ajax({
	                type: "post",
	                url: $that.options.url,
	                contentType: "application/json",
	                dataType: "json",
	                data: JSON.stringify({ "base64": $that.compress(image) }),
	                success: function(data){
	                	$that.options.callBack(data)
	                }
	            });
	            
	        };
	    };  
	};
	$.fn.upLoadImg=function(options){
		var $el=this;
		$el.change(function(){
		 	var img= new imgFiles($el, options);
			img.getImages();
		});
	};
}(jQuery));