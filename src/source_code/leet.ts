export default `#version 330 core

in vec2 TexCoords;
in vec3 Normal;
in vec3 FragPos;
in vec3 Tangent;
in vec3 Bitangent;

out vec4 color;

uniform sampler2D tex;
uniform sampler2D normalMap;
uniform sampler2D heightMap;
uniform sampler2D specularMap;

uniform vec3 lightPos;
uniform vec3 lColor;
uniform vec3 viewPos;
uniform float specularStrength;
uniform float displacementScale;

void main()
{
    vec3 norm = texture(normalMap, TexCoords).rgb;
    norm = normalize(norm * 2.0 - 1.0);
    vec3 tangent = normalize(Tangent);
    vec3 bitangent = normalize(Bitangent);
    mat3 TBN = mat3(tangent, bitangent, norm);
    vec3 lightDir = normalize(lightPos - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = 0.0;
    vec3 viewDir = normalize(viewPos - FragPos);
    if (diff > 0.0)
    {
        spec = pow(max(dot(viewDir, reflectDir), 0.0), specularStrength);
        spec = spec * specularStrength;
    }
    vec3 ambient = 0.3 * lColor;
    vec3 diffuse = diff * lColor;
    vec3 specular = spec * lColor;
    vec3 result = (ambient + diffuse + specular) * texture(tex, TexCoords).rgb;
    float height = texture(heightMap, TexCoords).r;
    float displacement = height * displacementScale - 0.5;
    vec3 displacedPos = FragPos + norm * displacement;
    color = vec4(result, 1.0);
}`
