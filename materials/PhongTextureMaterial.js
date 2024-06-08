class TexturedPhongMaterial extends Material {
    constructor(gl, image, Ka=[0,0,0], Kd=[0,0,0], Ks=[0,0,0], shininess=1) {
        let vertexShaderSource =
            `#version 300 es
    in vec4 a_position;
    in vec3 a_normal;
    in vec2 a_texcoord;

    uniform mat4 u_VM_matrix;
    uniform mat4 u_PVM_matrix;

    out vec3 v_position;
    out vec3 v_normal;
    out vec2 v_texcoord;

    void main() {
      v_position = vec3(u_VM_matrix * a_position);
      v_normal = vec3(u_VM_matrix * vec4(a_normal, 0));
      v_texcoord = a_texcoord;

      gl_Position = u_PVM_matrix * a_position;
    }`;

        let fragmentShaderSource =
            `#version 300 es
    precision mediump float;

    in vec3 v_position;
    in vec3 v_normal;
    in vec2 v_texcoord;

    struct Light {
      vec3 position;
      vec3 La;
      vec3 Ld;
      vec3 Ls;
    };

    struct Material {
      vec3 Ka;
      vec3 Kd;
      vec3 Ks;
      float shininess;
    };

    uniform Light u_light;
    uniform Material u_material;
    uniform sampler2D u_texture;

    out vec4 pixelColor;

    vec3 ambiental() {
      return u_material.Ka * u_light.La;
    }

    vec3 difuso(vec3 L, vec3 N) {
      return u_material.Kd * u_light.Ld * max(dot(N, L), 0.0);
    }

    vec3 especular(vec3 L, vec3 N) {
      vec3 R = normalize(2.0 * N * dot(N, L) - L);
      vec3 V = normalize(-v_position);

      return u_material.Ks * u_light.Ls * pow(max(dot(R, V), 0.0), u_material.shininess);
    }

    void main() {
      vec3 L = normalize(u_light.position - v_position);
      vec3 N = normalize(v_normal);

      vec3 ambient_color = ambiental();
      vec3 diffuse_color = difuso(L, N);
      vec3 specular_color = especular(L, N);

      vec4 textureColor = texture(u_texture, v_texcoord);

      pixelColor = vec4(ambient_color + textureColor.rgb * diffuse_color + specular_color, textureColor.a);
    }`;

        super(gl, [1,1,1,1], vertexShaderSource, fragmentShaderSource);

        this.Ka = Ka;
        this.Kd = Kd;
        this.Ks = Ks;
        this.shininess = shininess;

        this.texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}