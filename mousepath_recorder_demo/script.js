const screenshotTarget = document.body;
const btn = document.getElementById("show-btn");
var mousePath = []

btn.onclick = () => {
    html2canvas(screenshotTarget).then((canvas) => {
        
        var first = true
        const ctx = canvas.getContext('2d');

        ctx.lineWidth = 3;
        ctx.beginPath();

        mousePath.forEach(element => {
        if (!first){
		    ctx.lineTo(element[0], element[1]);
        } else {
            ctx.moveTo(element[0], element[1]);
            first = false;
        }
        });

        ctx.strokeStyle = 'red';
		ctx.stroke();
        
        const base64image = canvas.toDataURL("image/png");

        window.location.href = base64image;
    });
}



document.onmousemove = function(e){
    const currentPos = [e.pageX, e.pageY];
    mousePath.push(currentPos);
};