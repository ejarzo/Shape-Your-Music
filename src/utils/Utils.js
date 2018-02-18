const Utils = {
    dist: (x0,y0,x1,y1) => {
        return Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0));
    },
    
    // knobs 
    describeArc: (x, y, radius, startAngle, endAngle) => {
        var start = polarToCartesian(x, y, radius, endAngle);
        var end = polarToCartesian(x, y, radius, startAngle);
        var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
        var d = [
            'M', start.x, start.y, 
            'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(' ');
        return d;       
    },

    convertValToRange: (oldVal, oldMin, oldMax, newMin, newMax) => {
        return (((oldVal - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
    },
    
    // shapes 
    getAngle: (p1, p2, p3) => {
        const atanA = Math.atan2(p1.x - p2.x, p1.y - p2.y);
        const atanC = Math.atan2(p3.x - p2.x, p3.y - p2.y);
        let diff = atanA - atanC;
        diff = diff * 180 / Math.PI;
        return diff;
    },

    thetaToScaleDegree: (theta, scaleObj) => {
        if (theta < 0) {
            theta = theta + 360;
        }

        if (theta > 180) {
            theta = theta - 360;
        }
        
        // right turn or left turn
        const negMult = theta < 0 ? 1 : -1;
        const absTheta = Math.abs(theta);

        // find sector
        const notesInScale = scaleObj.simple().length - 1;
        const dTheta = 180 / notesInScale;
        let lowerBound = 0;
        let upperBound = dTheta;
        
        let degreeDiff = 0;
        for (let i = notesInScale; i > 0; i--) {
            if(isBetween(absTheta, lowerBound, upperBound)) {
                degreeDiff = i * negMult;
                break;
            }
            lowerBound = upperBound;
            upperBound += dTheta;
        }
        return degreeDiff;
    },

    getTotalLength: (points) => {
        let len = 0;
        const n = points.length;

        for (let i = 2; i < points.length; i+=2) {
            const x = points[i];
            const y = points[i+1];
            const prevX = points[i-2];
            const prevY = points[i-1];
            len += Utils.dist(x,y,prevX,prevY);
        }

        // last edge
        len += Utils.dist(points[0], points[1], points[n-2], points[n-1]);
        return len;
    },

    getAveragePoint: (points) => {
        let totalX = 0;
        let totalY = 0;
        
        for (var i = 0; i < points.length; i += 2) {
            totalX += points[i];
            totalY += points[i+1];
        }

        return {
            x: totalX / (points.length / 2),
            y: totalY / (points.length / 2)
        };
    },

    forEachPoint: (points, callback) => {
        for (var i = 0; i < points.length; i += 2) {
            let p = {
                x: points[i],
                y: points[i+1]
            };
            callback(p, i);
        }
    },

    isEquivalent: (a, b) => {
        const aProps = Object.getOwnPropertyNames(a);
        const bProps = Object.getOwnPropertyNames(b);
        if (aProps.length !== bProps.length) {
            return false;
        }
        for (let i = 0; i < aProps.length; i++) {
            const propName = aProps[i];
            if (a[propName] !== b[propName]) {
                return false;
            }
        }
        return true;
    }
};

function isBetween (val, a, b) {
    return (val >= a && val <= b);
}

function polarToCartesian (centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

export default Utils;
