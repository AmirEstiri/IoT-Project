package com.example.myapplication;

import java.util.List;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface iotAPI {

    @GET("api/changeLampState/{lid}")
    Call<Message> changeLampState(@Path("lid") int lid);

    @GET("api/getLampState/{lid}")
    Call<Message> getLampState(@Path("lid") int lid);

}
