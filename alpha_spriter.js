/*
-
    Made by Andrei Selin
    This is under "from me to you" licence.
    Thanks to http://habrahabr.ru/post/154103/ author for speeding up the producing
-
*/

// change this according to your current mood
var sample_settings = {
    w:555,
    h:324,
    elements:[
        {
            id:"element_id",
            t:"b", // "i" = image, "b" = background
            x:0,
            y:0,
            w:225,
            h:324
        },{
            id:"another_element_id",
            t:"i", // "i" = image, "b" = background
            x:225,
            y:0,
            w:330,
            h:324
        }
    ]
}


var alpha_spriter = function(
    rgb_src,
    alpha_src,
    json_src,
    then
){
    
    var compile_rgba = function(raw_rgb, raw_alpha){

        
        
        if (!raw_rgb.width || !raw_rgb.height || !raw_alpha.width || !raw_alpha.height){ 
            return false;
        }
        /*
        if (raw_rgb.width !== raw_alpha.width || raw_rgb.height !== raw_alpha.height){
            alert('Размеры RGB и прозрачности не сходятся');
            return false;
        }
        */

        // settings width/height and real images width/height equalityis to be tested here

        var canvas_rgb = document.createElement("canvas");
        var canvas_alpha = document.createElement("canvas");
        var canvas_frame = document.createElement("canvas");

        if (
               !canvas_rgb   || !canvas_rgb.getContext('2d') 
            || !canvas_alpha || !canvas_alpha.getContext('2d')
            || !canvas_frame || !canvas_frame.getContext('2d')
        ){
            alert('Troubles with canvas');
            return;
        }
        
        
        /*
        canvas_rgb.width = raw_rgb.width;
        canvas_rgb.height = raw_rgb.height;
        canvas_alpha.width = raw_alpha.width;
        canvas_alpha.height = raw_alpha.height;
        canvas_frame.width = raw_alpha.width;
        canvas_frame.height = raw_alpha.height;
        */

        canvas_rgb.width    = spriter_settings.w;
        canvas_rgb.height   = spriter_settings.h;
        canvas_alpha.width  = spriter_settings.w;
        canvas_alpha.height = spriter_settings.h;
        canvas_frame.width  = spriter_settings.w;
        canvas_frame.height = spriter_settings.h;
        
        
        
        
        
        
        var context_rgb = canvas_rgb.getContext('2d');
        var context_alpha = canvas_alpha.getContext('2d');
        var context_frame = canvas_frame.getContext('2d');

        context_rgb.drawImage(raw_rgb, 0, 0);
        context_alpha.drawImage(raw_alpha, 0, 0);

        
        
        
        
        var pix_rgb   = context_rgb  .getImageData(0, 0, raw_rgb.width, raw_rgb.height);
        var pix_alpha = context_alpha.getImageData(0, 0, raw_alpha.width, raw_alpha.height);
        
        
        
        

        for (var i = 0, n = pix_rgb.width * pix_rgb.height * 4; i < n; i += 4){
            pix_rgb.data[i+3] = pix_alpha.data[i];
        }

        context_frame.putImageData(pix_rgb, 0, 0);

        // saving blocks
        for(i=0; i<spriter_settings.elements.length; i++){
            the_element = spriter_settings.elements[i];
            var element_canvas    = document.createElement("canvas");
            var element_context   = element_canvas.getContext('2d');
            element_canvas.width  = the_element.w;
            element_canvas.height = the_element.h;

            var element_data=context_frame.getImageData(
                the_element.x,
                the_element.y,
                the_element.w,
                the_element.h
            );
            element_context.putImageData(element_data,0,0);
            if(document.getElementById(the_element.id)){
                if(the_element.t === "i"){
                    document.getElementById(the_element.id).src = element_canvas.toDataURL();
                }else if(the_element.t === "b"){
                    document.getElementById(the_element.id).style.backgroundImage = "url("+element_canvas.toDataURL()+")";
                }
                // console.log(document.getElementById(the_element.id).src);
            }else{
                console.warn("The element is not found by id: "+the_element.id)
            }
        }
        
        return then;

    }
        
    
    
    
        
    // var spriter_settings = JSON.parse(json_src);
    var spriter_settings = json_src;
    var img_rgb = new Image();
    var img_alpha = new Image();
    var img_count = 0;
    
    img_rgb.src = rgb_src;
    img_alpha.src = alpha_src;
        
    img_rgb.onload = function(){
        ++img_count;
        if(2 === img_count){
            return compile_rgba(img_rgb, img_alpha);
        }
    }
    img_alpha.onload = function(){
        ++img_count;
        if(2 === img_count){
            return compile_rgba(img_rgb, img_alpha);
        }
    }
    
    
    
    
}