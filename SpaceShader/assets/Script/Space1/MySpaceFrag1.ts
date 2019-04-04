export default class MySpaceFrag{
    static space_vert = `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    attribute vec4 a_color;
    varying vec2 v_texCoord;
    varying vec4 v_fragmentColor;
    void main()
    {
        gl_Position = CC_PMatrix * a_position;
        v_fragmentColor = a_color;
        v_texCoord = a_texCoord;
    }
    `;
       
    static space_frag = `
    #ifdef GL_ES
    precision mediump float;
    #endif
    
    #define iterations 15
    #define formuparam 0.5
    
    #define volsteps 10
    #define stepsize 0.2
    
    #define zoom   1.0//0.800
    #define tile   0.85//0.850
    #define speed  0.005
    
    #define brightness 0.0015//0.0015
    #define darkmatter 0.1//0.300
    #define distfading 0.73//0.730
    #define saturation 0.85//0.850
    
    uniform vec2      iResolution;           // viewport resolution (in pixels)
    uniform float     iTime;                 // shader playback time (in seconds) 
    
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        //get coords and direction
        vec2 uv=fragCoord.xy/iResolution.xy-.5;
        uv.y*=iResolution.y/iResolution.x;
        vec3 dir=vec3(uv*zoom,1.);
        float time=iTime*speed+.25;
    
        //mouse rotation
        float a1=.5+.5/iResolution.x*2.;
        float a2=.8+.5/iResolution.y*2.;
        mat2 rot1=mat2(cos(a1),sin(a1),-sin(a1),cos(a1));
        mat2 rot2=mat2(cos(a2),sin(a2),-sin(a2),cos(a2));
        dir.xz*=rot1;
        dir.xy*=rot2;
        vec3 from=vec3(1.,.5,0.5);
        from+=vec3(time*2.,time,-2.);
        from.xz*=rot1;
        from.xy*=rot2;
        
        //volumetric rendering
        float s=0.1,fade=1.;
        vec3 v=vec3(0.);
        for (int r=0; r<volsteps; r++) {
            vec3 p=from+s*dir*.5;
            p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
            float pa,a=pa=0.;
            for (int i=0; i<iterations; i++) { 
                p=abs(p)/dot(p,p)-formuparam; // the magic formula
                a+=abs(length(p)-pa); // absolute sum of average change
                pa=length(p);
            }
            float dm=max(0.,darkmatter-a*a*.001); //dark matter
            a*=a*a; // add contrast
            if (r>6) fade*=1.-dm; // dark matter, don't render near
            v+=vec3(dm,dm*.5,0.);
            v+=fade;
            v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
            fade*=distfading; // distance fading
            s+=stepsize;
        }
        v=mix(vec3(length(v)),v,saturation); //color adjust
        fragColor = vec4(v*.01,1.);	
        
    }
    void main()
    {
        mainImage(gl_FragColor, gl_FragCoord.xy);
    }
    `;
}