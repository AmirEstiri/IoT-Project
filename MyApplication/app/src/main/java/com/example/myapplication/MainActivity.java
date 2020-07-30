package com.example.myapplication;

import androidx.appcompat.app.AppCompatActivity;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import java.util.List;

public class MainActivity extends AppCompatActivity {
    private TextView textViewResult;
    String URL_BASE = "http://192.168.1.105:8081";
    private String state[] = new String[6];

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(URL_BASE + "/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        final Button btn[] = new Button[6];
        btn[0] = findViewById(R.id.button);
        btn[1] = findViewById(R.id.button2);
        btn[2] = findViewById(R.id.button3);
        btn[3] = findViewById(R.id.button4);
        btn[4] = findViewById(R.id.button5);
        btn[5] = findViewById(R.id.button6);

        final iotAPI iotapi = retrofit.create(iotAPI.class);

        final Thread thread = new Thread() {

            @Override
            public void run() {
                while(true) {
                    try {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Call<Message> call1 = iotapi.getLampState(1);
                                call1.enqueue(new Callback<Message>() {
                                    @Override
                                    public void onResponse(Call<Message> call1, Response<Message> response) {
                                        if (!response.isSuccessful()) {
                                            return;
                                        }
                                        Message msg = response.body();
                                        state[0] = msg.getMessage();
                                        if (state[0].equals("ON")) {
                                            btn[0].setBackgroundResource(R.color.colorLightON);
                                        } else {
                                            btn[0].setBackgroundResource(R.color.colorLightOFF);
                                        }
                                    }

                                    @Override
                                    public void onFailure(Call<Message> call1, Throwable t) {
                                        Log.d("FAILURE", t.getMessage());
                                    }
                                });

                                Call<Message> call2 = iotapi.getLampState(2);
                                call2.enqueue(new Callback<Message>() {
                                    @Override
                                    public void onResponse(Call<Message> call2, Response<Message> response) {
                                        if (!response.isSuccessful()) {
                                            return;
                                        }
                                        Message msg = response.body();
                                        state[1] = msg.getMessage();
                                        if (state[1].equals("ON")) {
                                            btn[1].setBackgroundResource(R.color.colorLightON);
                                        } else {
                                            btn[1].setBackgroundResource(R.color.colorLightOFF);
                                        }
                                    }

                                    @Override
                                    public void onFailure(Call<Message> call2, Throwable t) {
                                        Log.d("FAILURE", t.getMessage());
                                    }
                                });

                                Call<Message> call3 = iotapi.getLampState(3);
                                call3.enqueue(new Callback<Message>() {
                                    @Override
                                    public void onResponse(Call<Message> call3, Response<Message> response) {
                                        if (!response.isSuccessful()) {
                                            textViewResult.setText("Code: " + response.code());
                                            return;
                                        }
                                        Message msg = response.body();
                                        state[2] = msg.getMessage();
                                        if (state[2].equals("ON")) {
                                            btn[2].setBackgroundResource(R.color.colorLightON);
                                        } else {
                                            btn[2].setBackgroundResource(R.color.colorLightOFF);
                                        }
                                    }

                                    @Override
                                    public void onFailure(Call<Message> call3, Throwable t) {
                                        Log.d("FAILURE", t.getMessage());
                                    }
                                });

                                Call<Message> call4 = iotapi.getLampState(4);
                                call4.enqueue(new Callback<Message>() {
                                    @Override
                                    public void onResponse(Call<Message> call4, Response<Message> response) {
                                        if (!response.isSuccessful()) {
                                            textViewResult.setText("Code: " + response.code());
                                            return;
                                        }
                                        Message msg = response.body();
                                        state[3] = msg.getMessage();
                                        if (state[3].equals("ON")) {
                                            btn[3].setBackgroundResource(R.color.colorLightON);
                                        } else {
                                            btn[3].setBackgroundResource(R.color.colorLightOFF);
                                        }
                                    }

                                    @Override
                                    public void onFailure(Call<Message> call4, Throwable t) {
                                        Log.d("FAILURE", t.getMessage());
                                    }
                                });

                                Call<Message> call5 = iotapi.getLampState(5);
                                call5.enqueue(new Callback<Message>() {
                                    @Override
                                    public void onResponse(Call<Message> call5, Response<Message> response) {
                                        if (!response.isSuccessful()) {
                                            textViewResult.setText("Code: " + response.code());
                                            return;
                                        }
                                        Message msg = response.body();
                                        state[4] = msg.getMessage();
                                        if (state[4].equals("ON")) {
                                            btn[4].setBackgroundResource(R.color.colorLightON);
                                        } else {
                                            btn[4].setBackgroundResource(R.color.colorLightOFF);
                                        }
                                    }

                                    @Override
                                    public void onFailure(Call<Message> call5, Throwable t) {
                                        Log.d("FAILURE", t.getMessage());
                                    }
                                });

                                Call<Message> call6 = iotapi.getLampState(6);
                                call6.enqueue(new Callback<Message>() {
                                    @Override
                                    public void onResponse(Call<Message> call6, Response<Message> response) {
                                        if (!response.isSuccessful()) {
                                            textViewResult.setText("Code: " + response.code());
                                            return;
                                        }
                                        Message msg = response.body();
                                        state[5] = msg.getMessage();
                                        if (state[5].equals("ON")) {
                                            btn[5].setBackgroundResource(R.color.colorLightON);
                                        } else {
                                            btn[5].setBackgroundResource(R.color.colorLightOFF);
                                        }
                                    }

                                    @Override
                                    public void onFailure(Call<Message> call6, Throwable t) {
                                        Log.d("FAILURE", t.getMessage());
                                    }
                                });
                            }
                        });
                        Thread.sleep(10000);
                    } catch (InterruptedException e) {
                    }
                }
            }
        };
        thread.start();

        View.OnClickListener btnClick[] = new View.OnClickListener[6];
        btnClick[0] = new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Call<Message> call = iotapi.changeLampState(1);
                call.enqueue(new Callback<Message>() {
                    @Override
                    public void onResponse(Call<Message> call, Response<Message> response) {
                        if (!response.isSuccessful()) {
                            textViewResult.setText("Code: " + response.code());
                            return;
                        }
                        Message msg = response.body();
                        state[0] = msg.getMessage();
                        if (state[0].equals("ON")) {
                            btn[0].setBackgroundResource(R.color.colorLightON);
                        } else {
                            btn[0].setBackgroundResource(R.color.colorLightOFF);
                        }
                    }

                    @Override
                    public void onFailure(Call<Message> call, Throwable t) {
                        Log.d("FAILURE", t.getMessage());
                    }
                });
            }
        };

        btnClick[1] = new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Call<Message> call = iotapi.changeLampState(2);
                call.enqueue(new Callback<Message>() {
                    @Override
                    public void onResponse(Call<Message> call, Response<Message> response) {

                        if (!response.isSuccessful()) {
                            textViewResult.setText("Code: " + response.code());
                            return;
                        }
                        Message msg = response.body();
                        state[1] = msg.getMessage();
                        if (state[1].equals("ON")) {
                            btn[1].setBackgroundResource(R.color.colorLightON);
                        } else {
                            btn[1].setBackgroundResource(R.color.colorLightOFF);
                        }
                    }

                    @Override
                    public void onFailure(Call<Message> call, Throwable t) {
                        Log.d("FAILURE", t.getMessage());
                    }
                });
            }
        };

        btnClick[2] = new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Call<Message> call = iotapi.changeLampState(3);
                call.enqueue(new Callback<Message>() {
                    @Override
                    public void onResponse(Call<Message> call, Response<Message> response) {

                        if (!response.isSuccessful()) {
                            textViewResult.setText("Code: " + response.code());
                            return;
                        }
                        Message msg = response.body();
                        state[2] = msg.getMessage();
                        if (state[2].equals("ON")) {
                            btn[2].setBackgroundResource(R.color.colorLightON);
                        } else {
                            btn[2].setBackgroundResource(R.color.colorLightOFF);
                        }
                    }

                    @Override
                    public void onFailure(Call<Message> call, Throwable t) {
                        Log.d("FAILURE", t.getMessage());
                    }
                });
            }
        };

        btnClick[3] = new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Call<Message> call = iotapi.changeLampState(4);
                call.enqueue(new Callback<Message>() {
                    @Override
                    public void onResponse(Call<Message> call, Response<Message> response) {

                        if (!response.isSuccessful()) {
                            textViewResult.setText("Code: " + response.code());
                            return;
                        }
                        Message msg = response.body();
                        state[3] = msg.getMessage();
                        if (state[3].equals("ON")) {
                            btn[3].setBackgroundResource(R.color.colorLightON);
                        } else {
                            btn[3].setBackgroundResource(R.color.colorLightOFF);
                        }
                    }

                    @Override
                    public void onFailure(Call<Message> call, Throwable t) {
                        Log.d("FAILURE", t.getMessage());
                    }
                });
            }
        };

        btnClick[4] = new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Call<Message> call = iotapi.changeLampState(5);
                call.enqueue(new Callback<Message>() {
                    @Override
                    public void onResponse(Call<Message> call, Response<Message> response) {

                        if (!response.isSuccessful()) {
                            textViewResult.setText("Code: " + response.code());
                            return;
                        }
                        Message msg = response.body();
                        state[4] = msg.getMessage();
                        if (state[4].equals("ON")) {
                            btn[4].setBackgroundResource(R.color.colorLightON);
                        } else {
                            btn[4].setBackgroundResource(R.color.colorLightOFF);
                        }
                    }

                    @Override
                    public void onFailure(Call<Message> call, Throwable t) {
                        Log.d("FAILURE", t.getMessage());
                    }
                });
            }
        };

        btnClick[5] = new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Call<Message> call = iotapi.changeLampState(6);
                call.enqueue(new Callback<Message>() {
                    @Override
                    public void onResponse(Call<Message> call, Response<Message> response) {

                        if (!response.isSuccessful()) {
                            textViewResult.setText("Code: " + response.code());
                            return;
                        }
                        Message msg = response.body();
                        state[5] = msg.getMessage();
                        if (state[5].equals("ON")) {
                            btn[5].setBackgroundResource(R.color.colorLightON);
                        } else {
                            btn[5].setBackgroundResource(R.color.colorLightOFF);
                        }
                    }

                    @Override
                    public void onFailure(Call<Message> call, Throwable t) {
                        Log.d("FAILURE", t.getMessage());
                    }
                });
            }
        };

        btn[0].setOnClickListener(btnClick[0]);
        btn[1].setOnClickListener(btnClick[1]);
        btn[2].setOnClickListener(btnClick[2]);
        btn[3].setOnClickListener(btnClick[3]);
        btn[4].setOnClickListener(btnClick[4]);
        btn[5].setOnClickListener(btnClick[5]);
    }

}