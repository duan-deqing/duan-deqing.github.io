# duan-deqing.github.io
## 10.2.1 Thread类的构造方法

- Java中的线程体是由线程类的 `run()` 方法定义，该方法定义线程的具体行为。
- 线程从 `run()` 方法开始执行，与Java Application 从 `main()` 开始，Applet 从 `init()` 开始一样

### Thread类的构造方法

Thread类构造方法有很多，一般结构可以表示为：

```java
public Thread(ThreadGrooup group, Runnable target, String name);
```

- group : 指明线程所属的线程组
- target : 提供线程体的对象 
	Runnable 接口中定义的 `run()` 方法
- name : 线程名字
	name 为 `null` ，Java自动给线程赋予唯一的名称

上述方法的参数都可以为 `null` ，不同参数取`null` 值，组成Thread类的各种构造方法：

```java
public Thread();
public Thread(Runnable target);
public Thread(ThreadGrooup group, Runnable target, String name);
public Thread(String name);
public Thread(ThreadGrooup group, String name);
public Thread(Runnable target, String name);
public Thread(ThreadGrooup group, Runnable target, String name);
```

## 10.2.2 通过实现Runnable接口创建线程

java.lang 中 Runnable 接口的定义为

```java
public interface Runnable{
	void run();
}
```

### 使用 Runnable 接口创建线程的步骤：

1. 定义一个类实现 Runnable 接口，并提供 `run( )`方法的实现。
2. 把 Runnable 的一个实例作为参数传递给Thread 类的一个构造方法，该类实例对象提供线程体 `run()`。

例 10-1 通过实现Runnable接口创建线程。

```java
public class ThreadTest{
	public static void main(String args[]){
		//线程创建
		Thread t1 = new Thread(new Hello());
		Thread t2 = new Thread(new Hello());
		//启动线程，使线程处于Runnable状态
		t1.start();
		t2.start();
	}
	
}

class Hello implements Runnalbe{
	int i;//线程的数据
	//run()方法复写
	public void run(){
		while(true){
			System.out.println("Hello"+ i++);
			if(i == 5) break;
		}
	}
}
```


注：
1. 新建的线程不会自己运行，必须调用线程的 `start()` 方法。
2.  `start()` 方法将线程置为可运行( Runnable) 状态。
3. 可运行( Runnable) 状态，意味着该线程可以被调度运行，但不意味着线程会立即运行。


## 10.2.3 通过继承Thread类创建线程

### 通过继承Thread类创建线程的步骤：

1. 从Thread类派生子类，并重写其中的 `run()` 方法定义线程体。
2. 创建该子类的对象 创建线程

例10-2 通过继承Thread类创建线程.

```java
public class ThreadTest2{
	public static void main(String args[]){
		//线程创建
		Hello t1 = new Hello();
		Hello t2 = new Hello();
		//启动线程，使线程处于Runnable状态
		t1.start();
		t2.start();
	}
	
}

class Hello extends Thread{
	int i;//线程的数据
	//run()方法复写
	public void run(){
		while(true){
			System.out.println("Hello"+ i++);
			if(i == 5) break;
		}
	}
}
```

## 10.2.4 创建线程的两种方法的比较

1. 采用继承Thread类方法的优点
	程序代码简单，且可以在run( ) 方法中直接调用线程的其他方法。

2. 实现Runnable接口的优势
	1) 符合面向对象设计的思想
		 实现runnable接口的方法，将不影响Java Thread类的体系。
	2) 便于基础其他类
		 实现runnable接口的类可以用extends继承其他类。


## 10.2.4 创建线程补充


### Callable接口创建线程





### Future接口创建线程



















