var guitar = (function(){
    var exports = {};
    $(function(){

        var scale = 1024, scale2 = 1600;
        var width = scale, width2 = scale2;
        var height = 0.1*scale, height2 = 0.1*scale2;
        var frets = 24+ 1, frets2 = 36+1;
        var fretwidth = 3;
        var strings = 6;
        var offset = 0.5 * height/strings, offset2 = 0.5 * height2/strings;
        var markscale = 0.7;

        var fret = [];
        var string = [];
        var fretboard = [];

        //var notes = ["A", "B", "C", "D", "E", "F", "G"];
        var allnotes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
        //var nosharps = [1, 4];
        //var noflats = [2, 5];
        var modes = ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"];
        var mode = modes[0];
        var ionian = [2, 2, 1, 2, 2, 2, 1];
        var tuning = ["E", "B", "G", "D", "A", "E"];

        $("#guitar").width(width).height(height);
        $("#guitar2").width(width2).height(height2);

        for (var i = 0; i < frets; i++) {
            var left = scale - (scale/(Math.pow(2, i*2/frets)));
            fret.push(left);
            if(i===0) continue;
            $("<div class='fret' style='left:"+left+"px'></div>").width(fretwidth).height(height).appendTo("#guitar");
        }
        for (var i = 0; i < frets2; i++) {
            if(i===0) continue;
            $("<div class='fret' style='left:"+(i*(width2/frets2))+"px'></div>").width(fretwidth).height(height2).appendTo("#guitar2");
        }

        for (var i = 0; i < strings; i++) {
            var top = height/6 * i + offset;
            $("<div class='string' style='top:"+top+"px'></div>").width(width).height(i+1).appendTo("#guitar");
            string.push(top);
        }
        for (var i = 0; i < strings; i++) {
            var top = height2/6 * i + offset2;
            $("<div class='string' style='top:"+top+"px'></div>").width(width2).height(i+1).appendTo("#guitar2");
            //string.push(top);
        }

        for (var i = 0; i < string.length; i++) {
            var top = string[i];
            var fretmarks = [];
            for (var j = 0; j < fret.length; j++) {
                var left = fret[j];
                var marksize = markscale*(height/strings);
                var curnote = (allnotes[(allnotes.indexOf(tuning[i])+j)%12])
                fretmarks.push($("<div class='mark' style='top:"+(top-markscale*offset)+"px; left:"+(left-markscale*offset*2)+"px; line-height:"+marksize+"px; font-size:"+0.8*marksize+"px;'></div>").text(curnote).width(marksize).height(marksize).attr("data-string", i).attr("data-fret", j).attr("data-note", curnote).appendTo("#guitar"));
            }
            fretboard.push(fretmarks);
        }
        for (var i = 0; i < strings; i++) {
            for (var j = 0; j < frets2; j++) {
                var marksize = markscale*(height2/strings);
                var curnote = (allnotes[(allnotes.indexOf(tuning[i])+j)%12]);
                $("<div class='mark' style='top:"+(height2/6 * i + offset2-marksize/2)+"px; left:"+(j*(width2/frets2)-markscale*offset2*2)+"px; line-height:"+marksize+"px; font-size:"+0.8*marksize+"px;'></div>").text(curnote).width(marksize).height(marksize).attr("data-string", i).attr("data-fret", j).attr("data-note", curnote).appendTo("#guitar2");
            }
        }

        allnotes.forEach(function(i){
            var selected = i==="C" ? "selected='selected'" : "";
            $("#key").append("<option "+selected+">"+i+"</option>");
        });

        modes.forEach(function(i){
            $("#mode").append("<option>"+i+"</option>");
        });

        function setFretText(stringnum, fretnum, txt){
            fretboard[stringnum][fretnum].css("visibility", "visible").text(txt);
        }

        function hideFret(stringnum, fretnum){
            fretboard[stringnum][fretnum].css("visibility", "hidden");
        }

        function hideAllFrets(){
            $("#guitar, #guitar2").find(".mark").css({"visibility": "hidden", "color": "white", "transform": "none", "font-weight": "normal"});
        }

        function getKeyScale(key, mod){
            var keyscale = [];
            var pos = allnotes.indexOf(key);
            var shiftby = modes.indexOf(mod);
            var clonedionian = ionian.slice();
            var neededmode = clonedionian.concat(clonedionian.splice(0,shiftby));
            for (var i = 0; i < 7; i++) {
                keyscale.push(allnotes[pos]);
                pos = (pos+neededmode[i])%12;
            }
            return keyscale;
        }

        function updateKeyScale(key, mod){
            hideAllFrets();
            var keyscalenotes = getKeyScale(key, mod);
            $("#guitar, #guitar2").find(".mark").each(function(k,v){
                for (var i = 0; i < keyscalenotes.length; i++) {
                    var note = keyscalenotes[i];
                    //if(k.attr("data-note"))
                    var element = $(v);
                    if(element.attr("data-note") === note){
                        element.css("visibility", "visible");
                        if(i===0){
                            element.css({"color": "#FF1493","font-weight": "bold", "transform": "scale(1.3,1.3)"});
                        } else if(i===2){
                            element.css("color", "#ffd700");
                        } else if(i===4){
                            element.css("color", "#ffff00");
                        }
                    }
                }
            });
        }

        updateKeyScale("C", "Ionian");

        $("#key, #mode").change(function(){
            var key = $("#key").find(":selected").text();
            var mod = $("#mode").find(":selected").text();
            updateKeyScale(key, mod);
        });

        exports.setFretText = setFretText;
        exports.hideFret = hideFret;
        exports.hideAllFrets = hideAllFrets;
        exports.getKeyScale = getKeyScale;

    });

    return exports;
})();