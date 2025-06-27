package com.medical.record.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.*;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

//curl -X POST https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions \
//-H "Authorization: Bearer sk-d864316d4bc44adba8cd0dc4f57c2ef9" \
//-H "Content-Type: application/json" \
//-d '{
//    "model": "qwen-plus",
//    "messages": [
//        {
//            "role": "system",
//            "content": "You are a helpful assistant."
//        },
//        {
//            "role": "user",
//            "content": "你能做病例总结吗"
//        }
//    ]
//}'
@Configuration
@ConfigurationProperties(prefix = "qwen")
public class QWenConfig {


    private String baseURL;
    private String apiKey;
    private String model;
    private int timeout;
    private RestTemplate restTemplate;
    @Autowired
    public void setRestTemplate(RestTemplate restTemplate) {
        // 获取原始的RequestFactory并设置超时
        if (restTemplate.getRequestFactory() instanceof SimpleClientHttpRequestFactory) {
            SimpleClientHttpRequestFactory factory =
                    (SimpleClientHttpRequestFactory) restTemplate.getRequestFactory();
            factory.setConnectTimeout(timeout);
            factory.setReadTimeout(timeout);
        }
        this.restTemplate = restTemplate;
    }


    public String getBaseURL() {
        return baseURL;
    }

    public void setBaseURL(String baseURL) {
        this.baseURL = baseURL;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public int getTimeout() {
        return timeout;
    }

    public void setTimeout(int timeout) {
        this.timeout = timeout;
    }

    public String sendChatRequest(String userMessage) {
        // 设置请求头
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);

        // 构建请求体
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);

//        Map<String, String> systemMessage = new HashMap<>();
//        systemMessage.put("role", "system");
//        systemMessage.put("content", "You are a helpful assistant.");

        Map<String, String> userChatMessage = new HashMap<>();
        userChatMessage.put("role", "user");
        userChatMessage.put("content", userMessage);

//        requestBody.put("messages", new Object[]{systemMessage, userChatMessage});
        requestBody.put("messages", new Object[]{ userChatMessage});


        // 创建HTTP请求实体
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        // 发送请求并获取响应
        ResponseEntity<String> response = restTemplate.exchange(
                baseURL,
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        // 处理响应
        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        } else {
            throw new RuntimeException("API request failed: " + response.getStatusCode());
        }
    }

//    public String send(String message){
//        OpenAIClient client = OpenAIOkHttpClient.builder()
//                .apiKey(System.getenv("DASHSCOPE_API_KEY"))
//                .baseUrl("https://dashscope.aliyuncs.com/compatible-mode/v1")
//                .build();
//        ChatCompletionCreateParams params = ChatCompletionCreateParams.builder()
//                .addUserMessage("你是谁")
//                .model("qwen-plus")
//                .build();
//        ChatCompletion chatCompletion = client.chat().completions().create(params);
//        String result = chatCompletion.choices().get(0).message().content().orElse("无返回内容");
//        return result;
//    }

    public static void main(String[] args) {
        // 示例用法
//        String apiKey = "sk-d864316d4bc44adba8cd0dc4f57c2ef9";
//        String apiUrl = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
//        QWenConfig client = new QWenConfig(apiKey, apiUrl);
//
//        try {
//            String response = client.sendChatRequest("你能做病例总结吗");
//            System.out.println("API Response: " + response);
//        } catch (Exception e) {
//            e.printStackTrace();
//        }

    }
}
