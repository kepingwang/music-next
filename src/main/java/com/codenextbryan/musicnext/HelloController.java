package com.codenextbryan.musicnext;

// Following https://spring.io/guides/gs/spring-boot/

import org.apache.http.Consts;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@RestController
public class HelloController {

    @RequestMapping("/")
    public String index() {
        return "Greetings from Spring Boot!";
    }

    @RequestMapping("/api/some-request")
    public String someRequest() throws Exception {
        CloseableHttpClient client = HttpClientBuilder.create().build();
        HttpGet request = new HttpGet("https://kepingwang.com/");
        HttpResponse response = client.execute(request);
        return EntityUtils.toString(response.getEntity()).replaceAll("\\<.*?\\>", "");
    }

    @RequestMapping("/api/spotify/{artistId}")
    public String spotify(@PathVariable(value = "artistId") String artistId) throws Exception {
        CloseableHttpClient client = HttpClientBuilder.create().build();

        List<NameValuePair> form = new ArrayList<>();
        form.add(new BasicNameValuePair("grant_type", "client_credentials"));
        UrlEncodedFormEntity tokenEntity = new UrlEncodedFormEntity(form, Consts.UTF_8);

        HttpPost httpPost = new HttpPost("https://accounts.spotify.com/api/token");
        httpPost.setEntity(tokenEntity);
        String encodedAuth = Base64.getEncoder().encodeToString("".getBytes());
        httpPost.addHeader("Authorization", "Basic " + encodedAuth);

//        HttpGet request = new HttpGet("https://api.spotify.com/v1/artists/" + artistId);
//        HttpResponse response = client.execute(request);

        HttpResponse response = client.execute(httpPost);
        return EntityUtils.toString(response.getEntity());
    }

}
