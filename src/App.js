import React, { useState } from 'react';
import Sketch from 'react-p5';

const size = 800;
const columns = size / 16;

const yFactor = 2;
const columnWidth = size / columns;
const columnOffset = columnWidth / 2;

const fontSize = 200;
const fontOffset = -fontSize * .1;
const pixelDensity = 1;
const frameRate = 60;
const text = 'pace\nand\nspace';

let font;
let pg;
let index;
let cindex;
let color;

let c = undefined;
let start = undefined;
let end = undefined;

let tempGradients = [];

function App() {

    const [ gradients, setGradients ] = useState( [] );
    const preload = ( p5 ) => {
        // load your font here
        // font = p5.loadFont( '/fonts/NeueMontreal-Regular.otf' );
    };

    const setup = ( p5, canvasParentRef ) => {

        p5.createCanvas( size, size, p5.P2D ).parent( canvasParentRef );
        p5.pixelDensity( pixelDensity );
        p5.frameRate( frameRate );

        pg = p5.createGraphics( size, size, p5.P2D );
        pg.pixelDensity( pixelDensity );
        p5.background( 0 );
        p5.loadPixels();

        // set your font here
        // pg.textFont( font );
        pg.textSize( fontSize );
        pg.textLeading( fontSize * .7 );
        pg.textAlign( p5.CENTER, p5.CENTER );
        pg.fill( 255 );
        pg.text( text, size / 2, size / 2 );
        pg.loadPixels();

    };



    const draw = ( p5 ) => {

        p5.fill( 0, 0, 0 );
        p5.rect( 0, 0, size, size );
        pg.fill( 0 );
        pg.rect( 0, 0, size, size );
        pg.fill( 255 );

        // animate the graphics
        pg.push();
        pg.translate( size / 2, size / 2 );
        pg.shearX( -p5.radians( Math.cos( p5.frameCount * .02 ) * 10 ) );
        pg.scale( 1, 1 + ( ( Math.sin( p5.frameCount * .01 ) * .5 ) ) * .5 );
        pg.text( text, 0, fontOffset );
        pg.loadPixels();
        pg.pop();

        tempGradients = [];

        for ( let x = 0; x < columns; x++ ) {

            c = undefined;
            start = undefined;
            end = undefined;

            for ( let y = 0; y < size / yFactor; y++ ) {

                index = ( x * columnWidth * 4 * pixelDensity ) + ( y * size * yFactor * 4 * pixelDensity ) * pixelDensity;
                cindex = index + ( columnOffset * 4 );

                if ( pg.pixels[cindex] > 0 ) {
                    color = 255;
                } else {
                    color = 0;
                }

                pg.pixels[index + 0] = color;
                pg.pixels[index + 1] = color;
                pg.pixels[index + 2] = color;
                pg.pixels[index + 0] = color;

                if ( color != c ) {
                    if ( start == undefined ) {
                        c = color;
                        start = y * yFactor;
                    } else {
                        end = y * yFactor;

                        if ( c === 255 ) {
                            tempGradients.push( { x, color: c, start, end } );
                        }

                        c = color;
                        start = y * yFactor;
                        end = undefined;
                    }
                }
            }
        }

        setGradients( tempGradients );

    };

    const renderGradients = () => {
        return gradients.map( ( gradient, index ) => {
            return <div key={index} className="gradient" style={{ left: `${gradient.x * columnWidth}px`, top: `${gradient.start}px`, width: `${columnWidth}px`, height: `${gradient.end - gradient.start}px` }}></div>;
        } );
    };

    return <>
        <Sketch setup={setup} draw={draw} preload={preload} className={'source'} />
        <div className="html" style={{ width: `${size}px`, height: `${size}px` }}>{renderGradients()}</div>
    </>;

}

export default App;
