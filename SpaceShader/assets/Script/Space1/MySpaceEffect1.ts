// Feofox Game
// Author:Lerry
// https://github.com/fylz1125/ShaderDemos
import Space from './MySpaceFrag1';
const { ccclass, property } = cc._decorator;

@ccclass
export default class SpaceEffect extends cc.Component {

    program: cc.GLProgram;
    startTime:number = Date.now();
    time: number = 0;

    resolution={ x:0.0, y:0.0};

    onLoad() {
        this.resolution.x = ( this.node.getContentSize().width );
        this.resolution.y = ( this.node.getContentSize().height );
        this.useSpace();
        
    }

    start() {
        cc.director.setDisplayStats(false);
    }

    useSpace() {
        if (this.program) return;
        this.program = new cc.GLProgram();
        if (cc.sys.isNative) {
            this.program.initWithString(Space.space_vert, Space.space_frag);
        } else {
            this.program.initWithVertexShaderByteArray(Space.space_vert, Space.space_frag);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
        }
        this.program.link();
        this.program.updateUniforms();
        this.program.use();

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
            glProgram_state.setUniformFloat("iTime", this.time);
            glProgram_state.setUniformVec2( "iResolution", this.resolution );
        } else {
            let res = this.program.getUniformLocationForName( "iResolution" );
            let ba = this.program.getUniformLocationForName("iTime");
            this.program.setUniformLocationWith2f( res, this.resolution.x,this.resolution.y );
            this.program.setUniformLocationWith1f(ba, this.time);
        }
        this.setProgram(this.node.getComponent(cc.Sprite)._sgNode, this.program);
    }

    setProgram(node: any, program: any) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }
    }

    update(dt) {
        this.time = (Date.now() - this.startTime) / 1000 + 90;
        if (this.program) {
            this.program.use();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
                glProgram_state.setUniformFloat("iTime", this.time);
            } else {
                let ct = this.program.getUniformLocationForName("iTime");
                this.program.setUniformLocationWith1f(ct, this.time);
            }
        }
    }
}
