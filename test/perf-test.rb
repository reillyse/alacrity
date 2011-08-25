# going to send a load of requests against the server using realistic data and then see how she holds up
require 'rubygems'
require 'curb'
get_times = Array.new
update_times = Array.new
connect_failures = Array.new

class Array
  def sum 
    inject( nil ) { |sum,x| sum ? sum+x : x }
  end

  def mean 
    sum.to_f / size.to_f
  end
end

def update_data(player,rank,update_times,connect_failures)
  begin
    start_time = Time.now
    c = Curl::Easy.http_post("http://localhost:8888/updatePlayerRanking","playerNum=#{player}&rank=#{rank}"
                             ) do |curl|
      curl.headers['Accept'] = 'application/text-html'
      curl.headers['Content-Type'] = 'application/text-html'
      curl.on_complete do |e|
        #     puts "complete"
        end_time = Time.now
        request_time = end_time - start_time
        #     puts "update request took #{request_time}"
        update_times << request_time
      end

    end
    
  rescue Exception => e 
    connect_failures << e
  end
end

def get_data(player,get_times,connect_failures)

  start_time = Time.now
  begin
    c = Curl::Easy.http_get("http://localhost:8888/getPlayerRanking?playerNum=#{player}") do |curl|
      curl.headers['Accept'] = 'application/text-html'
      curl.headers['Content-Type'] = 'application/text-html'
      curl.on_complete do |e|
        #      puts "complete"
        end_time = Time.now
        request_time = end_time - start_time
        #      puts "get request took #{request_time}"
        get_times << request_time
      end
    end
    
  rescue Exception => e 
    connect_failures << e
  end

end

pids = Array.new
pids << Kernel.fork do
  start_total = Time.now
  iterations = 100000;
  iterations.times do 
    get_data((rand * 50000).to_i,get_times,connect_failures)
  end
  end_total = Time.now
  #  puts "average response time per get request is #{(end_total - start_total)/iterations} "
  
  puts "gets: #{get_times.size}"
  puts get_times.mean
  puts  "get connect_failures = #{connect_failures.size}"
end

pids << Kernel.fork do
  100000.times do
    update_data((rand * 50000).to_i,(rand * 1000000).to_i,update_times,connect_failures)

  end
  puts "updates: #{update_times.size}"
  puts update_times.mean
  puts  "update connect_failures = #{connect_failures.size}"
end



pids.each do |pid|
  Process.wait(pid) # Explicitly wait for **each** pid individually
end
