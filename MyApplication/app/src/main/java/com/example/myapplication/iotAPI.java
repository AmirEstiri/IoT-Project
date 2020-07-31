package com.example.myapplication;

import java.util.List;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface iotAPI {

    @GET("api/changeLampStateAdmin/{lid}")
    Call<Message> changeLampStateAdmin(@Path("lid") int lid);

    @GET("api/getLampStateAdmin/{lid}")
    Call<Message> getLampStateAdmin(@Path("lid") int lid);

}
