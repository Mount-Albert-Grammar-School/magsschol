#include <iostream>
#include <algorithm>
#include <string>
#include <vector>
#include <cmath>
#include <map>
#include <set>
#include <cstring>
#include <queue>
#include <unordered_set>
#include <unordered_map>

using namespace std;

int f1(int x){
    return (x * x) % 10;
}

int f2(int x){
    return 0;
}

int f3(int x){
    return 0;
}

int f4(int x){
    return 0;
}

string f5(int a,int b){
    return "";
}

int f6(int a,int b){
    return 0;
}

int f7(int a,int b){
    return 0;
}

int f8(int a,int b){
    return 0;
}

bool f9(string s){
    return false;
}

int f10(string s){
    return 0;
}

int f11(string s){
    return 0;
}

int f12(int x){
    return 0;
}

#ifdef LOCAL_TEST
int main(){
    int S;
    cin>>S;
    if(S<=4){
        int x;
        cin>>x;

        if(S==1) cout<<"Your solution outputted: "<<f1(x)<<endl;
        else if(S==2) cout<<"Your solution outputted: "<<f2(x)<<endl;
        else if(S==3) cout<<"Your solution outputted: "<<f3(x)<<endl;
        else if(S==4) cout<<"Your solution outputted: "<<f4(x)<<endl;
    }
    else if(S<=8){
        int a,b;
        cin>>a>>b;

        if(S==5) cout<<"Your solution outputted: "<<f5(a,b)<<endl;
        else if(S==6) cout<<"Your solution outputted: "<<f6(a,b)<<endl;
        else if(S==7) cout<<"Your solution outputted: "<<f7(a,b)<<endl;
        else if(S==8) cout<<"Your solution outputted: "<<f8(a,b)<<endl;
    }
    else if(S<=11){
        string s;
        cin>>s;

        if(S==9) cout<<"Your solution outputted: "<<f9(s)<<endl;
        else if(S==10) cout<<"Your solution outputted: "<<f10(s)<<endl;
        else if(S==11) cout<<"Your solution outputted: "<<f11(s)<<endl;
    }
    else if(S==12){
        int x;
        cin>>x;
        cout<<"Your solution outputted: "<<f12(x)<<endl;
    }
}
#endif